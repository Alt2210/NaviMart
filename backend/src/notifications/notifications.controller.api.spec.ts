import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AuthState, createApiTestApp } from '../../test/utils/api-test-app';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

const DEFAULT_USER = { userId: 'u1', role: 'user', activeFamilyId: 'f1' };

describe('Notifications API (HTTP contract)', () => {
  let app: INestApplication;
  const authState: AuthState = { user: { ...DEFAULT_USER } };
  const notificationsService = {
    findAll: jest.fn(),
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
  };

  beforeAll(async () => {
    app = await createApiTestApp({
      controllers: [NotificationsController],
      providers: [
        { provide: NotificationsService, useValue: notificationsService },
      ],
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

  it('API-NTF-001: list notifications → 200', async () => {
    notificationsService.findAll.mockResolvedValue([]);
    await http().get('/api/notifications?unreadOnly=true').expect(200);
    expect(notificationsService.findAll).toHaveBeenCalled();
  });

  it('API-NTF-002: chưa đăng nhập → 401', async () => {
    authState.user = null;
    await http().get('/api/notifications').expect(401);
    expect(notificationsService.findAll).not.toHaveBeenCalled();
  });

  it('API-NTF-003: limit ngoài khoảng (0) → 400, service không gọi', async () => {
    await http().get('/api/notifications?limit=0').expect(400);
    expect(notificationsService.findAll).not.toHaveBeenCalled();
  });

  it('API-NTF-004: mark read → 200, service nhận id', async () => {
    notificationsService.markAsRead.mockResolvedValue({ id: 'n1', readAt: new Date() });
    await http().patch('/api/notifications/n1/read').expect(200);
    expect(notificationsService.markAsRead).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'u1' }),
      'n1',
    );
  });

  it('API-NTF-005: mark all read → 200', async () => {
    notificationsService.markAllAsRead.mockResolvedValue({ modifiedCount: 3 });
    await http().patch('/api/notifications/read-all').expect(200);
    expect(notificationsService.markAllAsRead).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'u1' }),
    );
  });
});
