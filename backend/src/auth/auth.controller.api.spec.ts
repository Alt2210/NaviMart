import {
  BadRequestException,
  ConflictException,
  INestApplication,
  UnauthorizedException,
} from '@nestjs/common';
import request from 'supertest';
import { createApiTestApp, AuthState } from '../../test/utils/api-test-app';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

const DEFAULT_USER = { userId: 'u1', role: 'user', activeFamilyId: 'f1' };
const VALID_REGISTER = {
  email: 'new@example.com',
  password: 'Sup3rSecret!',
  firstName: 'New',
  lastName: 'User',
};

describe('Auth API (HTTP contract)', () => {
  let app: INestApplication;
  const authState: AuthState = { user: { ...DEFAULT_USER } };
  const authService = {
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    sendVerification: jest.fn(),
    verifyEmail: jest.fn(),
  };

  beforeAll(async () => {
    app = await createApiTestApp({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
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

  it('API-AUTH-001: register hợp lệ → 201', async () => {
    authService.register.mockResolvedValue({ user: {}, tokens: {} });
    await http().post('/api/auth/register').send(VALID_REGISTER).expect(201);
    expect(authService.register).toHaveBeenCalled();
  });

  it('API-AUTH-002: thiếu password → 400, service không gọi', async () => {
    const { password: _omit, ...body } = VALID_REGISTER;
    await http().post('/api/auth/register').send(body).expect(400);
    expect(authService.register).not.toHaveBeenCalled();
  });

  it('API-AUTH-003: field lạ → 400 (forbidNonWhitelisted)', async () => {
    await http()
      .post('/api/auth/register')
      .send({ ...VALID_REGISTER, hacker: 1 })
      .expect(400);
    expect(authService.register).not.toHaveBeenCalled();
  });

  it('API-AUTH-004: email/phone trùng → 409', async () => {
    authService.register.mockRejectedValue(
      new ConflictException('Email or phone already exists'),
    );
    await http().post('/api/auth/register').send(VALID_REGISTER).expect(409);
  });

  it('API-AUTH-005: login hợp lệ → 200', async () => {
    authService.login.mockResolvedValue({ user: {}, tokens: {} });
    await http()
      .post('/api/auth/login')
      .send({ identifier: 'new@example.com', password: 'Sup3rSecret!' })
      .expect(200);
  });

  it('API-AUTH-006: sai credential → 401', async () => {
    authService.login.mockRejectedValue(
      new UnauthorizedException('Invalid credentials'),
    );
    await http()
      .post('/api/auth/login')
      .send({ identifier: 'new@example.com', password: 'Sup3rSecret!' })
      .expect(401);
  });

  it('API-AUTH-007: refresh unwrap refreshToken', async () => {
    authService.refresh.mockResolvedValue({ user: {}, tokens: {} });
    const token = 'r'.repeat(40);
    await http().post('/api/auth/refresh').send({ refreshToken: token }).expect(200);
    expect(authService.refresh).toHaveBeenCalledWith(token);
  });

  it('API-AUTH-008: logout không token → 401, service không gọi', async () => {
    authState.user = null;
    await http().post('/api/auth/logout').expect(401);
    expect(authService.logout).not.toHaveBeenCalled();
  });

  it('API-AUTH-009: forgot-password luôn 200', async () => {
    authService.forgotPassword.mockResolvedValue({ success: true });
    await http()
      .post('/api/auth/forgot-password')
      .send({ identifier: 'whoever@example.com' })
      .expect(200);
  });

  it('API-AUTH-010: verify-email token sai → 400', async () => {
    authService.verifyEmail.mockRejectedValue(
      new BadRequestException('Invalid verification token'),
    );
    await http().post('/api/auth/verify-email').send({ token: '000000' }).expect(400);
  });
});
