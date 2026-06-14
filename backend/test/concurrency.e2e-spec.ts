import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection } from 'mongoose';
import request from 'supertest';
import { App } from 'supertest/types';

/**
 * Concurrency e2e: fire several consume requests at the SAME pantry item at once
 * and assert the no-oversell invariant — the total consumed quantity must never
 * exceed the initial stock, and stock must never go negative. Guards against the
 * classic read-modify-write race in stock deduction.
 */
describe('Concurrency: pantry stock deduction (e2e)', () => {
  let app: INestApplication<App>;
  let mongo: MongoMemoryServer | undefined;
  let dbConnection: Connection;
  let token: string;

  beforeAll(async () => {
    mongo =
      process.env.E2E_USE_MEMORY_MONGO === 'true'
        ? await MongoMemoryServer.create()
        : undefined;

    process.env.NODE_ENV = 'test';
    process.env.MONGODB_URI =
      process.env.E2E_MONGODB_URI ??
      mongo?.getUri() ??
      `mongodb://127.0.0.1:27017/navimart_conc_${Date.now()}`;
    process.env.MONGODB_DB_NAME = `navimart_conc_${Date.now()}`;
    process.env.JWT_ACCESS_SECRET = 'test-access-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
    process.env.JWT_ACCESS_EXPIRES_IN = '15m';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';
    process.env.EXPIRY_NOTIFICATION_CRON = '0 0 1 1 *';

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { AppModule } =
      require('../src/app.module') as typeof import('../src/app.module');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
    dbConnection = moduleFixture.get<Connection>(getConnectionToken());

    const reg = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'owner.conc@example.com',
        password: 'Sup3rSecret!',
        firstName: 'Owner',
        lastName: 'Conc',
        familyName: 'Family Conc',
      })
      .expect(201);
    token = reg.body.tokens.accessToken;
  }, 120000);

  afterAll(async () => {
    await dbConnection?.dropDatabase();
    await app?.close();
    await mongo?.stop();
  });

  it('INT-CONC-001: never oversells when consuming the full stock concurrently', async () => {
    const INITIAL_STOCK = 2;
    const created = await request(app.getHttpServer())
      .post('/api/pantry')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Trung ga',
        quantity: INITIAL_STOCK,
        unit: 'pcs',
        expiryDate: '2099-01-01T00:00:00.000Z',
      })
      .expect(201);
    const itemId = created.body.id ?? created.body.item?.id;

    // 5 requests each trying to consume the entire stock at once.
    const responses = await Promise.all(
      Array.from({ length: 5 }, () =>
        request(app.getHttpServer())
          .post(`/api/pantry/${itemId}/consume`)
          .set('Authorization', `Bearer ${token}`)
          .send({ quantity: INITIAL_STOCK }),
      ),
    );

    const successes = responses.filter((r) => r.status === 200);

    // Read back the authoritative stock.
    const after = await request(app.getHttpServer())
      .get(`/api/pantry/${itemId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const finalQuantity = after.body.quantity;

    // Core invariants: stock never negative, and the number of successful
    // full-stock consumes cannot exceed what the stock allowed (exactly 1).
    expect(finalQuantity).toBeGreaterThanOrEqual(0);
    expect(successes.length).toBe(1);
    expect(finalQuantity).toBe(0);
  });
});
