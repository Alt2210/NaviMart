import {
  BadRequestException,
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
import { PantryController } from './pantry.controller';
import { PantryService } from './pantry.service';

const DEFAULT_USER = { userId: 'u1', role: 'user', activeFamilyId: 'f1' };

describe('Pantry API (HTTP contract)', () => {
  let app: INestApplication;
  const authState: AuthState = { user: { ...DEFAULT_USER } };
  const permState: PermState = { allow: true };
  const pantryService = {
    findAll: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    consume: jest.fn(),
    markWasted: jest.fn(),
  };

  beforeAll(async () => {
    app = await createApiTestApp({
      controllers: [PantryController],
      providers: [{ provide: PantryService, useValue: pantryService }],
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

  it('API-PAN-001: list pantry → 200', async () => {
    pantryService.findAll.mockResolvedValue([]);
    await http().get('/api/pantry?status=active').expect(200);
    expect(pantryService.findAll).toHaveBeenCalled();
  });

  it('API-PAN-002: chưa đăng nhập → 401', async () => {
    authState.user = null;
    await http().get('/api/pantry').expect(401);
    expect(pantryService.findAll).not.toHaveBeenCalled();
  });

  it('API-PAN-003: tạo item thiếu quyền → 403, service không gọi', async () => {
    permState.allow = false;
    await http()
      .post('/api/pantry')
      .send({ name: 'Eggs', quantity: 1, unit: 'pcs', expiryDate: '2099-01-01T00:00:00.000Z' })
      .expect(403);
    expect(pantryService.create).not.toHaveBeenCalled();
  });

  it('API-PAN-004: body quantity âm → 400', async () => {
    await http()
      .post('/api/pantry')
      .send({ name: 'Eggs', quantity: -1, unit: 'pcs', expiryDate: '2099-01-01T00:00:00.000Z' })
      .expect(400);
    expect(pantryService.create).not.toHaveBeenCalled();
  });

  it('API-PAN-005: consume quantity ≤ 0 → 400, service không gọi', async () => {
    await http().post('/api/pantry/abc/consume').send({ quantity: 0 }).expect(400);
    expect(pantryService.consume).not.toHaveBeenCalled();
  });

  it('API-PAN-006: consume vượt tồn → 400 (mapping BadRequest)', async () => {
    pantryService.consume.mockRejectedValue(
      new BadRequestException('Consumed quantity exceeds current stock'),
    );
    await http().post('/api/pantry/abc/consume').send({ quantity: 5 }).expect(400);
    expect(pantryService.consume).toHaveBeenCalled();
  });

  it('API-PAN-007: item không tồn tại → 404', async () => {
    pantryService.findOne.mockRejectedValue(
      new NotFoundException('Pantry item not found'),
    );
    await http().get('/api/pantry/abc').expect(404);
  });

  it('API-PAN-008: waste → 200', async () => {
    pantryService.markWasted.mockResolvedValue({ id: 'abc', status: 'wasted' });
    await http().post('/api/pantry/abc/waste').expect(200);
    expect(pantryService.markWasted).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'u1' }),
      'abc',
    );
  });
});
