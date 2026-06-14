import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AuthState, createApiTestApp } from '../../test/utils/api-test-app';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';

const DEFAULT_USER = { userId: 'u1', role: 'user', activeFamilyId: 'f1' };

describe('Catalog API (HTTP contract)', () => {
  let app: INestApplication;
  const authState: AuthState = { user: { ...DEFAULT_USER } };
  const catalogService = {
    findAllCategories: jest.fn(),
    findAllFoods: jest.fn(),
    findAllUnits: jest.fn(),
  };

  beforeAll(async () => {
    app = await createApiTestApp({
      controllers: [CatalogController],
      providers: [{ provide: CatalogService, useValue: catalogService }],
      authState,
      authGuards: [JwtAuthGuard],
    });
  });

  afterAll(() => app.close());

  beforeEach(() => {
    jest.clearAllMocks();
    authState.user = { ...DEFAULT_USER };
  });

  const http = () => request(app.getHttpServer());

  it('API-CAT-001: list categories → 200', async () => {
    catalogService.findAllCategories.mockResolvedValue([]);
    await http().get('/api/catalog/categories').expect(200);
    expect(catalogService.findAllCategories).toHaveBeenCalled();
  });

  it('API-CAT-002: chưa đăng nhập → 401', async () => {
    authState.user = null;
    await http().get('/api/catalog/categories').expect(401);
    expect(catalogService.findAllCategories).not.toHaveBeenCalled();
  });

  it('API-CAT-003: list foods kèm query → 200, service nhận query', async () => {
    catalogService.findAllFoods.mockResolvedValue([]);
    await http().get('/api/catalog/foods?q=milk&limit=5').expect(200);
    expect(catalogService.findAllFoods).toHaveBeenCalledWith(
      expect.objectContaining({ q: 'milk', limit: 5 }),
    );
  });

  it('API-CAT-004: foods limit ngoài khoảng (0) → 400, service không gọi', async () => {
    await http().get('/api/catalog/foods?limit=0').expect(400);
    expect(catalogService.findAllFoods).not.toHaveBeenCalled();
  });

  it('API-CAT-005: list units → 200', async () => {
    catalogService.findAllUnits.mockResolvedValue([]);
    await http().get('/api/catalog/units').expect(200);
    expect(catalogService.findAllUnits).toHaveBeenCalled();
  });
});
