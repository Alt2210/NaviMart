import {
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import request from 'supertest';
import {
  AuthState,
  createApiTestApp,
  PermState,
} from '../../test/utils/api-test-app';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FamilyPermissionGuard } from '../auth/guards/family-permission.guard';
import { MealsController } from './meals.controller';
import { MealsService } from './meals.service';

const DEFAULT_USER = { userId: 'u1', role: 'user', activeFamilyId: 'f1' };
const RANGE = 'startDate=2026-06-01T00:00:00.000Z&endDate=2026-06-30T00:00:00.000Z';

describe('Meals API (HTTP contract)', () => {
  let app: INestApplication;
  const authState: AuthState = { user: { ...DEFAULT_USER } };
  const permState: PermState = { allow: true };
  const mealsService = {
    findAll: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    getMissingIngredients: jest.fn(),
    generateShoppingList: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(async () => {
    app = await createApiTestApp({
      controllers: [MealsController],
      providers: [{ provide: MealsService, useValue: mealsService }],
      authState,
      permState,
      authGuards: [JwtAuthGuard],
      permissionGuards: [FamilyPermissionGuard],
    });
  });

  afterAll(() => app.close());

  beforeEach(() => {
    jest.clearAllMocks();
    authState.user = { ...DEFAULT_USER };
    permState.allow = true;
  });

  const http = () => request(app.getHttpServer());

  it('API-MEAL-001: list meals theo date range → 200', async () => {
    mealsService.findAll.mockResolvedValue([]);
    await http().get(`/api/meals?${RANGE}`).expect(200);
    expect(mealsService.findAll).toHaveBeenCalled();
  });

  it('API-MEAL-002: chưa đăng nhập → 401', async () => {
    authState.user = null;
    await http().get(`/api/meals?${RANGE}`).expect(401);
    expect(mealsService.findAll).not.toHaveBeenCalled();
  });

  it('API-MEAL-003: thiếu startDate/endDate → 400', async () => {
    await http().get('/api/meals').expect(400);
    expect(mealsService.findAll).not.toHaveBeenCalled();
  });

  it('API-MEAL-004: tạo meal thiếu quyền → 403, service không gọi', async () => {
    permState.allow = false;
    await http()
      .post('/api/meals')
      .send({ date: '2026-06-12T00:00:00.000Z', session: 'dinner', customName: 'Mi trung' })
      .expect(403);
    expect(mealsService.create).not.toHaveBeenCalled();
  });

  it('API-MEAL-005: tạo meal thiếu session → 400, service không gọi', async () => {
    await http()
      .post('/api/meals')
      .send({ date: '2026-06-12T00:00:00.000Z', customName: 'Mi trung' })
      .expect(400);
    expect(mealsService.create).not.toHaveBeenCalled();
  });

  it('API-MEAL-006: tạo meal hợp lệ → 201, service gọi', async () => {
    mealsService.create.mockResolvedValue({ id: 'm1' });
    await http()
      .post('/api/meals')
      .send({ date: '2026-06-12T00:00:00.000Z', session: 'dinner', customName: 'Mi trung' })
      .expect(201);
    expect(mealsService.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'u1' }),
      expect.objectContaining({ session: 'dinner' }),
    );
  });

  it('API-MEAL-007: meal không tồn tại → 404', async () => {
    mealsService.findOne.mockRejectedValue(new NotFoundException('Meal plan not found'));
    await http().get('/api/meals/abc').expect(404);
  });

  it('API-MEAL-008: missing-ingredients → 200', async () => {
    mealsService.getMissingIngredients.mockResolvedValue({ missing: [] });
    await http().get('/api/meals/abc/missing-ingredients').expect(200);
    expect(mealsService.getMissingIngredients).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'u1' }),
      'abc',
    );
  });
});
