import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
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
import { FamiliesController } from './families.controller';
import { FamiliesService } from './families.service';

const DEFAULT_USER = { userId: 'u1', role: 'user', activeFamilyId: 'f1' };

describe('Family API (HTTP contract)', () => {
  let app: INestApplication;
  const authState: AuthState = { user: { ...DEFAULT_USER } };
  const permState: PermState = { allow: true };
  const familiesService = {
    getCurrentFamily: jest.fn(),
    create: jest.fn(),
    createInvite: jest.fn(),
    join: jest.fn(),
    updateMemberPermissions: jest.fn(),
    removeMember: jest.fn(),
  };

  beforeAll(async () => {
    app = await createApiTestApp({
      controllers: [FamiliesController],
      providers: [{ provide: FamiliesService, useValue: familiesService }],
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

  it('API-FAM-001: lấy family hiện tại → 200', async () => {
    familiesService.getCurrentFamily.mockResolvedValue({ id: 'f1' });
    await http().get('/api/family').expect(200);
  });

  it('API-FAM-002: không có family → 404', async () => {
    familiesService.getCurrentFamily.mockRejectedValue(
      new NotFoundException('Current user does not have an active family'),
    );
    await http().get('/api/family').expect(404);
  });

  it('API-FAM-003: tạo invite thiếu quyền → 403, service không gọi', async () => {
    permState.allow = false;
    await http()
      .post('/api/family/invite')
      .send({ permissions: ['edit_lists'] })
      .expect(403);
    expect(familiesService.createInvite).not.toHaveBeenCalled();
  });

  it('API-FAM-004: join mã sai/hết hạn → 404', async () => {
    familiesService.join.mockRejectedValue(
      new NotFoundException('Invite code is invalid or expired'),
    );
    await http().post('/api/family/join').send({ inviteCode: 'ABCDEF' }).expect(404);
  });

  it('API-FAM-005: join khi đã là member → 409', async () => {
    familiesService.join.mockRejectedValue(
      new ConflictException('User is already a family member'),
    );
    await http().post('/api/family/join').send({ inviteCode: 'ABCDEF' }).expect(409);
  });

  it('API-FAM-006: cập nhật quyền owner → 403', async () => {
    familiesService.updateMemberPermissions.mockRejectedValue(
      new ForbiddenException('Cannot update the family owner'),
    );
    await http()
      .patch('/api/family/members/m2/permissions')
      .send({ permissions: ['edit_lists'] })
      .expect(403);
  });

  it('API-FAM-007: tự sửa quyền mình → 400', async () => {
    familiesService.updateMemberPermissions.mockRejectedValue(
      new BadRequestException('Cannot update your own family permissions'),
    );
    await http()
      .patch('/api/family/members/u1/permissions')
      .send({ permissions: ['edit_lists'] })
      .expect(400);
  });
});
