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
import { ShoppingListsController } from './shopping-lists.controller';
import { ShoppingListsService } from './shopping-lists.service';

const DEFAULT_USER = { userId: 'u1', role: 'user', activeFamilyId: 'f1' };

describe('Shopping Lists API (HTTP contract)', () => {
  let app: INestApplication;
  const authState: AuthState = { user: { ...DEFAULT_USER } };
  const permState: PermState = { allow: true };
  const shoppingListsService = {
    findAll: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    complete: jest.fn(),
    addItem: jest.fn(),
    updateItem: jest.fn(),
    removeItem: jest.fn(),
  };

  beforeAll(async () => {
    app = await createApiTestApp({
      controllers: [ShoppingListsController],
      providers: [
        { provide: ShoppingListsService, useValue: shoppingListsService },
      ],
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

  it('API-SL-001: tạo list → 201', async () => {
    shoppingListsService.create.mockResolvedValue({ id: 'l1' });
    await http().post('/api/shopping-lists').send({ name: 'Cuoi tuan' }).expect(201);
    expect(shoppingListsService.create).toHaveBeenCalled();
  });

  it('API-SL-002: tạo list thiếu quyền → 403, service không gọi', async () => {
    permState.allow = false;
    await http().post('/api/shopping-lists').send({ name: 'Cuoi tuan' }).expect(403);
    expect(shoppingListsService.create).not.toHaveBeenCalled();
  });

  it('API-SL-003: thêm item thiếu quantity → 400', async () => {
    await http()
      .post('/api/shopping-lists/l1/items')
      .send({ name: 'Beef', unit: 'kg' })
      .expect(400);
    expect(shoppingListsService.addItem).not.toHaveBeenCalled();
  });

  it('API-SL-004: list không tồn tại → 404', async () => {
    shoppingListsService.findOne.mockRejectedValue(
      new NotFoundException('Shopping list not found'),
    );
    await http().get('/api/shopping-lists/l1').expect(404);
  });

  it('API-SL-005: hoàn tất list đã completed → 400', async () => {
    shoppingListsService.complete.mockRejectedValue(
      new BadRequestException('Shopping list is already completed'),
    );
    await http().post('/api/shopping-lists/l1/complete').send({}).expect(400);
  });

  it('API-SL-006: hoàn tất hợp lệ → 200 kèm pantryItems', async () => {
    shoppingListsService.complete.mockResolvedValue({
      shoppingList: { id: 'l1', status: 'completed' },
      pantryItems: [{ id: 'p1', name: 'Eggs' }],
    });
    const res = await http()
      .post('/api/shopping-lists/l1/complete')
      .send({})
      .expect(200);
    expect(res.body.pantryItems).toHaveLength(1);
  });
});
