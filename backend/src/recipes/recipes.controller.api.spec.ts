import { INestApplication, NotFoundException } from '@nestjs/common';
import request from 'supertest';
import {
  AuthState,
  createApiTestApp,
  PermState,
} from '../../test/utils/api-test-app';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FamilyPermissionGuard } from '../auth/guards/family-permission.guard';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

const DEFAULT_USER = { userId: 'u1', role: 'housewife', activeFamilyId: 'f1' };
const VALID_RECIPE = {
  name: 'Bo xao',
  cookTimeMinutes: 20,
  ingredients: [{ name: 'Beef', quantity: 1, unit: 'kg' }],
  steps: ['xao'],
};

describe('Recipes API (HTTP contract)', () => {
  let app: INestApplication;
  const authState: AuthState = { user: { ...DEFAULT_USER } };
  const permState: PermState = { allow: true };
  const recipesService = {
    findAll: jest.fn(),
    getSuggestions: jest.fn(),
    findFavorites: jest.fn(),
    findOne: jest.fn(),
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
    getMissingIngredients: jest.fn(),
    generateShoppingList: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(async () => {
    app = await createApiTestApp({
      controllers: [RecipesController],
      providers: [{ provide: RecipesService, useValue: recipesService }],
      authState,
      permState,
      authGuards: [JwtAuthGuard],
      permissionGuards: [RolesGuard, FamilyPermissionGuard],
    });
  });

  afterAll(() => app.close());

  beforeEach(() => {
    jest.clearAllMocks();
    authState.user = { ...DEFAULT_USER };
    permState.allow = true;
  });

  const http = () => request(app.getHttpServer());

  it('API-RCP-001: tìm kiếm recipe → 200', async () => {
    recipesService.findAll.mockResolvedValue([]);
    await http().get('/api/recipes?q=pho').expect(200);
    expect(recipesService.findAll).toHaveBeenCalled();
  });

  it('API-RCP-002: gợi ý món → 200', async () => {
    recipesService.getSuggestions.mockResolvedValue([]);
    await http().get('/api/recipes/suggestions?limit=5').expect(200);
  });

  it('API-RCP-003: missing-ingredients unwrap servings', async () => {
    recipesService.getMissingIngredients.mockResolvedValue({});
    await http().get('/api/recipes/r1/missing-ingredients?servings=4').expect(200);
    expect(recipesService.getMissingIngredients).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'u1' }),
      'r1',
      4,
    );
  });

  it('API-RCP-004: recipe archived → 404', async () => {
    recipesService.findOne.mockRejectedValue(
      new NotFoundException('Recipe not found'),
    );
    await http().get('/api/recipes/r1').expect(404);
  });

  it('API-RCP-005: tạo recipe sai role → 403, service không gọi', async () => {
    permState.allow = false;
    await http().post('/api/recipes').send(VALID_RECIPE).expect(403);
    expect(recipesService.create).not.toHaveBeenCalled();
  });

  it('API-RCP-006: tạo recipe thiếu name → 400', async () => {
    const { name: _omit, ...body } = VALID_RECIPE;
    await http().post('/api/recipes').send(body).expect(400);
    expect(recipesService.create).not.toHaveBeenCalled();
  });

  it('API-RCP-007: addFavorite → 201', async () => {
    recipesService.addFavorite.mockResolvedValue({ isFavorite: true });
    await http().post('/api/recipes/r1/favorite').expect(201);
    expect(recipesService.addFavorite).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'u1' }),
      'r1',
    );
  });
});
