import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
  AuthState,
  createApiTestApp,
  PermState,
} from '../../test/utils/api-test-app';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FamilyPermissionGuard } from '../auth/guards/family-permission.guard';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

const DEFAULT_USER = { userId: 'u1', role: 'user', activeFamilyId: 'f1' };
const RANGE = 'startDate=2026-06-01T00:00:00.000Z&endDate=2026-06-30T00:00:00.000Z';

describe('Reports API (HTTP contract)', () => {
  let app: INestApplication;
  const authState: AuthState = { user: { ...DEFAULT_USER } };
  const permState: PermState = { allow: true };
  const reportsService = {
    getDashboard: jest.fn(),
    getConsumptionTrends: jest.fn(),
    getWasteReport: jest.fn(),
  };

  beforeAll(async () => {
    app = await createApiTestApp({
      controllers: [ReportsController],
      providers: [{ provide: ReportsService, useValue: reportsService }],
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

  it('API-RPT-001: dashboard theo date range → 200', async () => {
    reportsService.getDashboard.mockResolvedValue({});
    await http().get(`/api/reports/dashboard?${RANGE}`).expect(200);
    expect(reportsService.getDashboard).toHaveBeenCalled();
  });

  it('API-RPT-002: chưa đăng nhập → 401', async () => {
    authState.user = null;
    await http().get(`/api/reports/dashboard?${RANGE}`).expect(401);
    expect(reportsService.getDashboard).not.toHaveBeenCalled();
  });

  it('API-RPT-003: thiếu quyền view_reports → 403, service không gọi', async () => {
    permState.allow = false;
    await http().get(`/api/reports/dashboard?${RANGE}`).expect(403);
    expect(reportsService.getDashboard).not.toHaveBeenCalled();
  });

  it('API-RPT-004: thiếu date range → 400, service không gọi', async () => {
    await http().get('/api/reports/dashboard').expect(400);
    expect(reportsService.getDashboard).not.toHaveBeenCalled();
  });

  it('API-RPT-005: consumption-trends → 200', async () => {
    reportsService.getConsumptionTrends.mockResolvedValue({});
    await http().get(`/api/reports/consumption-trends?${RANGE}`).expect(200);
    expect(reportsService.getConsumptionTrends).toHaveBeenCalled();
  });

  it('API-RPT-006: waste → 200', async () => {
    reportsService.getWasteReport.mockResolvedValue({});
    await http().get(`/api/reports/waste?${RANGE}`).expect(200);
    expect(reportsService.getWasteReport).toHaveBeenCalled();
  });
});
