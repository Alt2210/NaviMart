import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { INestApplication } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model } from 'mongoose';
import request from 'supertest';
import { App } from 'supertest/types';
import { Category } from '../src/catalog/schemas/category.schema';
import { Food } from '../src/catalog/schemas/food.schema';
import { Recipe } from '../src/recipes/schemas/recipe.schema';

type AuthContext = {
  accessToken: string;
  refreshToken: string;
  userId: string;
  familyId: string;
};

describe('Main user flows (e2e)', () => {
  let app: INestApplication<App>;
  let mongo: MongoMemoryServer | undefined;
  let dbConnection: Connection;
  let auth: AuthContext;
  let beefFoodId: string;
  let recipeId: string;

  beforeAll(async () => {
    mongo =
      process.env.E2E_USE_MEMORY_MONGO === 'true'
        ? await MongoMemoryServer.create()
        : undefined;

    process.env.NODE_ENV = 'test';
    process.env.MONGODB_URI =
      process.env.E2E_MONGODB_URI ??
      mongo?.getUri() ??
      `mongodb://127.0.0.1:27017/navimart_e2e_${Date.now()}`;
    process.env.MONGODB_DB_NAME = `navimart_e2e_${Date.now()}`;
    process.env.JWT_ACCESS_SECRET = 'test-access-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
    process.env.JWT_ACCESS_EXPIRES_IN = '15m';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';
    // Once a year at midnight Jan 1 — effectively disables the job during tests.
    process.env.EXPIRY_NOTIFICATION_CRON = '0 0 1 1 *';

    // AppModule must be imported AFTER the env vars above are set:
    // ConfigModule.forRoot({ validate }) snapshots process.env at import time.
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
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
    dbConnection = moduleFixture.get<Connection>(getConnectionToken());

    await seedCatalogAndRecipe(moduleFixture);
  }, 120000);

  afterAll(async () => {
    await dbConnection?.dropDatabase();
    await app?.close();
    await mongo?.stop();
  });

  it('registers, refreshes token, and reads the current family', async () => {
    const registerResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'linh.e2e@example.com',
        password: 'Sup3rSecret!',
        firstName: 'Linh',
        lastName: 'Nguyen',
        familyName: 'Gia dinh E2E',
      })
      .expect(201);

    expect(registerResponse.body.user.email).toBe('linh.e2e@example.com');
    expect(registerResponse.body.tokens.accessToken).toBeDefined();
    expect(registerResponse.body.tokens.refreshToken).toBeDefined();

    auth = {
      accessToken: registerResponse.body.tokens.accessToken,
      refreshToken: registerResponse.body.tokens.refreshToken,
      userId: registerResponse.body.user.id,
      familyId: registerResponse.body.user.activeFamilyId,
    };

    const refreshResponse = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken: auth.refreshToken })
      .expect(200);

    auth.accessToken = refreshResponse.body.tokens.accessToken;
    auth.refreshToken = refreshResponse.body.tokens.refreshToken;

    const familyResponse = await request(app.getHttpServer())
      .get('/api/family')
      .set('Authorization', bearer(auth.accessToken))
      .expect(200);

    expect(familyResponse.body.id).toBe(auth.familyId);
    expect(familyResponse.body.members).toHaveLength(1);
  });

  it('creates an invite and allows another user to join the family', async () => {
    const inviteResponse = await request(app.getHttpServer())
      .post('/api/family/invite')
      .set('Authorization', bearer(auth.accessToken))
      .send({
        permissions: ['edit_lists', 'edit_pantry'],
        expiresInHours: 24,
      })
      .expect(201);

    expect(inviteResponse.body.inviteCode).toBeDefined();

    const secondUserResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'member.e2e@example.com',
        password: 'Sup3rSecret!',
        firstName: 'Minh',
        lastName: 'Tran',
        familyName: 'Temporary Family',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/family/join')
      .set('Authorization', bearer(secondUserResponse.body.tokens.accessToken))
      .send({ inviteCode: inviteResponse.body.inviteCode })
      .expect(200);

    const familyResponse = await request(app.getHttpServer())
      .get('/api/family')
      .set('Authorization', bearer(auth.accessToken))
      .expect(200);

    expect(familyResponse.body.members).toHaveLength(2);
  });

  it('completes a shopping list and adds checked items to pantry', async () => {
    const listResponse = await request(app.getHttpServer())
      .post('/api/shopping-lists')
      .set('Authorization', bearer(auth.accessToken))
      .send({
        name: 'Di cho e2e',
        type: 'weekly',
      })
      .expect(201);

    const listId = listResponse.body.id;

    const addItemResponse = await request(app.getHttpServer())
      .post(`/api/shopping-lists/${listId}/items`)
      .set('Authorization', bearer(auth.accessToken))
      .send({
        foodId: beefFoodId,
        quantity: 500,
        unit: 'g',
      })
      .expect(201);

    const itemId = addItemResponse.body.items[0].id;

    await request(app.getHttpServer())
      .patch(`/api/shopping-lists/${listId}/items/${itemId}`)
      .set('Authorization', bearer(auth.accessToken))
      .send({ checked: true })
      .expect(200);

    const completeResponse = await request(app.getHttpServer())
      .post(`/api/shopping-lists/${listId}/complete`)
      .set('Authorization', bearer(auth.accessToken))
      .send({
        defaultExpiryDays: 2,
        defaultLocation: 'fridge',
      })
      .expect(200);

    expect(completeResponse.body.shoppingList.status).toBe('completed');
    expect(completeResponse.body.pantryItems).toHaveLength(1);
    expect(completeResponse.body.pantryItems[0].name).toBe('Thit bo');

    const pantryResponse = await request(app.getHttpServer())
      .get('/api/pantry')
      .query({ expiryStatus: 'expiring', expiryWarningDays: 3 })
      .set('Authorization', bearer(auth.accessToken))
      .expect(200);

    expect(pantryResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          foodId: beefFoodId,
          quantity: 500,
          expiryStatus: 'expiring',
        }),
      ]),
    );
  });

  it('filters pantry by safe, expiring, and expired status', async () => {
    await createPantryItem('Expired milk', -1);
    await createPantryItem('Expiring carrot', 1);
    await createPantryItem('Safe rice', 10);

    const expiredResponse = await request(app.getHttpServer())
      .get('/api/pantry')
      .query({ expiryStatus: 'expired' })
      .set('Authorization', bearer(auth.accessToken))
      .expect(200);

    expect(expiredResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Expired milk', expiryStatus: 'expired' }),
      ]),
    );

    const expiringResponse = await request(app.getHttpServer())
      .get('/api/pantry')
      .query({ expiryStatus: 'expiring', expiryWarningDays: 3 })
      .set('Authorization', bearer(auth.accessToken))
      .expect(200);

    expect(expiringResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Expiring carrot',
          expiryStatus: 'expiring',
        }),
      ]),
    );

    const safeResponse = await request(app.getHttpServer())
      .get('/api/pantry')
      .query({ expiryStatus: 'safe', expiryWarningDays: 3 })
      .set('Authorization', bearer(auth.accessToken))
      .expect(200);

    expect(safeResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Safe rice', expiryStatus: 'safe' }),
      ]),
    );
  });

  it('checks recipe missing ingredients and generates shopping lists', async () => {
    const recipeResponse = await request(app.getHttpServer())
      .get(`/api/recipes/${recipeId}`)
      .set('Authorization', bearer(auth.accessToken))
      .expect(200);

    expect(recipeResponse.body.name).toBe('Thit bo xao e2e');

    const missingResponse = await request(app.getHttpServer())
      .get(`/api/recipes/${recipeId}/missing-ingredients`)
      .query({ servings: 2 })
      .set('Authorization', bearer(auth.accessToken))
      .expect(200);

    expect(missingResponse.body.hasMissingIngredients).toBe(true);
    expect(missingResponse.body.missingIngredients).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          foodId: beefFoodId,
          missingQuantity: 200,
        }),
      ]),
    );

    const generatedResponse = await request(app.getHttpServer())
      .post(`/api/recipes/${recipeId}/generate-shopping-list`)
      .set('Authorization', bearer(auth.accessToken))
      .send({ name: 'Mua do recipe e2e', servings: 2 })
      .expect(201);

    expect(generatedResponse.body.shoppingList.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          foodId: beefFoodId,
          quantity: 200,
        }),
      ]),
    );
  });

  it('plans a meal, checks missing ingredients, generates a list, and reports activity', async () => {
    const mealResponse = await request(app.getHttpServer())
      .post('/api/meals')
      .set('Authorization', bearer(auth.accessToken))
      .send({
        date: '2026-06-12T00:00:00.000Z',
        session: 'dinner',
        recipeId,
        servings: 2,
      })
      .expect(201);

    const mealId = mealResponse.body.id;

    const missingResponse = await request(app.getHttpServer())
      .get(`/api/meals/${mealId}/missing-ingredients`)
      .set('Authorization', bearer(auth.accessToken))
      .expect(200);

    expect(missingResponse.body.hasMissingIngredients).toBe(true);

    const generatedResponse = await request(app.getHttpServer())
      .post(`/api/meals/${mealId}/generate-shopping-list`)
      .set('Authorization', bearer(auth.accessToken))
      .send({ name: 'Mua do meal e2e' })
      .expect(201);

    expect(generatedResponse.body.shoppingList.name).toBe('Mua do meal e2e');

    const pantryResponse = await request(app.getHttpServer())
      .get('/api/pantry')
      .query({ q: 'Thit bo' })
      .set('Authorization', bearer(auth.accessToken))
      .expect(200);

    await request(app.getHttpServer())
      .post(`/api/pantry/${pantryResponse.body[0].id}/consume`)
      .set('Authorization', bearer(auth.accessToken))
      .send({ quantity: 100, note: 'Cooked dinner' })
      .expect(200);

    const dashboardResponse = await request(app.getHttpServer())
      .get('/api/reports/dashboard')
      .query({
        startDate: '2020-01-01T00:00:00.000Z',
        endDate: '2030-01-01T00:00:00.000Z',
      })
      .set('Authorization', bearer(auth.accessToken))
      .expect(200);

    expect(dashboardResponse.body.shopping.completedLists).toBeGreaterThanOrEqual(1);
    expect(dashboardResponse.body.inventory.byEventType.added.count).toBeGreaterThanOrEqual(1);
    expect(dashboardResponse.body.inventory.byEventType.consumed.count).toBeGreaterThanOrEqual(1);
  });

  async function createPantryItem(name: string, daysFromToday: number) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysFromToday);

    return request(app.getHttpServer())
      .post('/api/pantry')
      .set('Authorization', bearer(auth.accessToken))
      .send({
        name,
        quantity: 1,
        unit: 'unit',
        expiryDate: expiryDate.toISOString(),
        location: 'fridge',
        source: 'manual',
      })
      .expect(201);
  }

  async function seedCatalogAndRecipe(moduleFixture: TestingModule) {
    const categoryModel = moduleFixture.get<Model<Category>>(
      getModelToken(Category.name),
    );
    const foodModel = moduleFixture.get<Model<Food>>(getModelToken(Food.name));
    const recipeModel = moduleFixture.get<Model<Recipe>>(
      getModelToken(Recipe.name),
    );

    const category = await categoryModel.create({
      name: 'Thit ca',
      slug: 'thit-ca',
      status: 'active',
    });

    const beef = await foodModel.create({
      name: 'Thit bo',
      normalizedName: 'thit bo',
      categoryId: category._id,
      defaultUnit: 'g',
      aliases: ['beef'],
      defaultStorageLocation: 'fridge',
      defaultShelfLifeDays: 3,
      isSystem: true,
      status: 'active',
    });

    const recipe = await recipeModel.create({
      name: 'Thit bo xao e2e',
      normalizedName: 'thit bo xao e2e',
      description: 'Recipe seeded for e2e tests.',
      cookTimeMinutes: 20,
      difficulty: 'easy',
      servings: 2,
      ingredients: [
        {
          foodId: beef._id,
          categoryId: category._id,
          name: beef.name,
          quantity: 700,
          unit: 'g',
          optional: false,
        },
      ],
      steps: ['Slice beef', 'Stir fry'],
      nutrition: { calories: 400 },
      tags: ['e2e'],
      status: 'approved',
    });

    beefFoodId = beef._id.toString();
    recipeId = recipe._id.toString();
  }
});

function bearer(accessToken: string) {
  return `Bearer ${accessToken}`;
}
