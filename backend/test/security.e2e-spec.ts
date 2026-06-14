import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import request from 'supertest';
import { App } from 'supertest/types';

/**
 * Security e2e: negative JWT paths and object-level authorization, exercised
 * through the REAL Spring/Nest guard + Passport strategy (not a mocked guard).
 * Mirrors the bootstrap of the other *.e2e-spec.ts files.
 */
describe('Security: JWT negative & object-level authorization (e2e)', () => {
  let app: INestApplication<App>;
  let mongo: MongoMemoryServer | undefined;
  let dbConnection: Connection;

  // Family A owner — owns the resources under test.
  let tokenA: string;
  let itemIdA: string;
  let listIdA: string;
  let mealIdA: string;
  // Family B owner — a different family, must not see A's resources.
  let tokenB: string;
  let userIdB: string;
  let familyIdB: string;

  const ACCESS_SECRET = 'test-access-secret';

  beforeAll(async () => {
    mongo =
      process.env.E2E_USE_MEMORY_MONGO === 'true'
        ? await MongoMemoryServer.create()
        : undefined;

    process.env.NODE_ENV = 'test';
    process.env.MONGODB_URI =
      process.env.E2E_MONGODB_URI ??
      mongo?.getUri() ??
      `mongodb://127.0.0.1:27017/navimart_sec_${Date.now()}`;
    process.env.MONGODB_DB_NAME = `navimart_sec_${Date.now()}`;
    process.env.JWT_ACCESS_SECRET = ACCESS_SECRET;
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
    process.env.JWT_ACCESS_EXPIRES_IN = '15m';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';
    process.env.EXPIRY_NOTIFICATION_CRON = '0 0 1 1 *';

    // AppModule imported AFTER env vars: ConfigModule snapshots process.env.
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

    // Register family A and create a pantry item owned by A.
    const regA = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'owner.a.sec@example.com',
        password: 'Sup3rSecret!',
        firstName: 'Owner',
        lastName: 'A',
        familyName: 'Family A',
      })
      .expect(201);
    tokenA = regA.body.tokens.accessToken;

    const created = await request(app.getHttpServer())
      .post('/api/pantry')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        name: 'Thit bo',
        quantity: 2,
        unit: 'kg',
        expiryDate: '2099-01-01T00:00:00.000Z',
      })
      .expect(201);
    itemIdA = created.body.id ?? created.body.item?.id;

    // A family-A shopping list and meal — also family-scoped resources.
    const listRes = await request(app.getHttpServer())
      .post('/api/shopping-lists')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'Di cho cuoi tuan' })
      .expect(201);
    listIdA = listRes.body.id ?? listRes.body._id;

    const mealRes = await request(app.getHttpServer())
      .post('/api/meals')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        date: '2099-01-01T00:00:00.000Z',
        session: 'dinner',
        customName: 'Com toi',
      })
      .expect(201);
    mealIdA = mealRes.body.id ?? mealRes.body._id;

    // Register family B (different family).
    const regB = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'owner.b.sec@example.com',
        password: 'Sup3rSecret!',
        firstName: 'Owner',
        lastName: 'B',
        familyName: 'Family B',
      })
      .expect(201);
    tokenB = regB.body.tokens.accessToken;
    userIdB = regB.body.user.id;
    familyIdB = regB.body.user.activeFamilyId;
  }, 120000);

  afterAll(async () => {
    await dbConnection?.dropDatabase();
    await app?.close();
    await mongo?.stop();
  });

  describe('SEC-JWT: negative authentication paths', () => {
    it('SEC-JWT-001: rejects a request with no Authorization header (401)', async () => {
      await request(app.getHttpServer()).get('/api/pantry').expect(401);
    });

    it('SEC-JWT-002: rejects a malformed bearer token (401)', async () => {
      await request(app.getHttpServer())
        .get('/api/pantry')
        .set('Authorization', 'Bearer not-a-real-jwt')
        .expect(401);
    });

    it('SEC-JWT-003: rejects a token signed with the wrong secret (401)', async () => {
      const forged = jwt.sign(
        { sub: userIdB, role: 'user', activeFamilyId: familyIdB },
        'totally-wrong-secret',
        { expiresIn: '15m' },
      );
      await request(app.getHttpServer())
        .get('/api/pantry')
        .set('Authorization', `Bearer ${forged}`)
        .expect(401);
    });

    it('SEC-JWT-004: rejects an expired token signed with the right secret (401)', async () => {
      const expired = jwt.sign(
        { sub: userIdB, role: 'user', activeFamilyId: familyIdB },
        ACCESS_SECRET,
        { expiresIn: '-10s' },
      );
      await request(app.getHttpServer())
        .get('/api/pantry')
        .set('Authorization', `Bearer ${expired}`)
        .expect(401);
    });

    it('SEC-JWT-005: rejects a well-formed token for a non-existent user (401)', async () => {
      // Valid signature + not expired, but sub points at no real active user.
      const ghost = jwt.sign(
        { sub: '0123456789abcdef01234567', role: 'user' },
        ACCESS_SECRET,
        { expiresIn: '15m' },
      );
      await request(app.getHttpServer())
        .get('/api/pantry')
        .set('Authorization', `Bearer ${ghost}`)
        .expect(401);
    });
  });

  describe('SEC-OBJ: object-level authorization', () => {
    it('SEC-OBJ-000: the owner (family A) can read its own pantry item (200)', async () => {
      await request(app.getHttpServer())
        .get(`/api/pantry/${itemIdA}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);
    });

    it("SEC-OBJ-001: family B cannot read family A's pantry item (404, no leak)", async () => {
      // Scoped by family → resource is invisible to other families.
      await request(app.getHttpServer())
        .get(`/api/pantry/${itemIdA}`)
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(404);
    });

    it("SEC-OBJ-002: family B cannot read family A's shopping list (404)", async () => {
      await request(app.getHttpServer())
        .get(`/api/shopping-lists/${listIdA}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);
      await request(app.getHttpServer())
        .get(`/api/shopping-lists/${listIdA}`)
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(404);
    });

    it("SEC-OBJ-003: family B cannot read family A's meal plan (404)", async () => {
      await request(app.getHttpServer())
        .get(`/api/meals/${mealIdA}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);
      await request(app.getHttpServer())
        .get(`/api/meals/${mealIdA}`)
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(404);
    });
  });
});
