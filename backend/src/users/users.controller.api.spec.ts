import { INestApplication, NotFoundException } from '@nestjs/common';
import request from 'supertest';
import { AuthState, createApiTestApp } from '../../test/utils/api-test-app';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const DEFAULT_USER = { userId: 'u1', role: 'user', activeFamilyId: 'f1' };

describe('Users API (HTTP contract)', () => {
  let app: INestApplication;
  const authState: AuthState = { user: { ...DEFAULT_USER } };
  const usersService = {
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
  };

  beforeAll(async () => {
    app = await createApiTestApp({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
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

  it('API-USR-001: lấy hồ sơ → 200', async () => {
    usersService.getProfile.mockResolvedValue({ id: 'u1' });
    await http().get('/api/users/me').expect(200);
    expect(usersService.getProfile).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'u1' }),
    );
  });

  it('API-USR-002: chưa đăng nhập → 401', async () => {
    authState.user = null;
    await http().get('/api/users/me').expect(401);
    expect(usersService.getProfile).not.toHaveBeenCalled();
  });

  it('API-USR-003: cập nhật hồ sơ hợp lệ → 200, service nhận dto', async () => {
    usersService.updateProfile.mockResolvedValue({ id: 'u1', firstName: 'Linh' });
    await http().patch('/api/users/me').send({ firstName: 'Linh' }).expect(200);
    expect(usersService.updateProfile).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'u1' }),
      expect.objectContaining({ firstName: 'Linh' }),
    );
  });

  it('API-USR-004: gender sai enum → 400, service không gọi', async () => {
    await http().patch('/api/users/me').send({ gender: 'unknown' }).expect(400);
    expect(usersService.updateProfile).not.toHaveBeenCalled();
  });

  it('API-USR-005: field lạ → 400 (forbidNonWhitelisted)', async () => {
    await http().patch('/api/users/me').send({ hacker: true }).expect(400);
    expect(usersService.updateProfile).not.toHaveBeenCalled();
  });

  it('API-USR-006: user không tồn tại → 404', async () => {
    usersService.getProfile.mockRejectedValue(new NotFoundException('User not found'));
    await http().get('/api/users/me').expect(404);
  });
});
