import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FamilyPermissions } from '../auth/decorators/family-permissions.decorator';
import { FamilyPermissionGuard } from '../auth/guards/family-permission.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { ReportDateRangeQueryDto } from './dto/report-date-range-query.dto';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, FamilyPermissionGuard)
@FamilyPermissions('view_reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @ApiOkResponse({ description: 'Family report dashboard.' })
  getDashboard(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ReportDateRangeQueryDto,
  ) {
    return this.reportsService.getDashboard(user, query);
  }

  @Get('consumption-trends')
  @ApiOkResponse({ description: 'Consumption and inventory event trends.' })
  getConsumptionTrends(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ReportDateRangeQueryDto,
  ) {
    return this.reportsService.getConsumptionTrends(user, query);
  }

  @Get('waste')
  @ApiOkResponse({ description: 'Waste report.' })
  getWasteReport(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ReportDateRangeQueryDto,
  ) {
    return this.reportsService.getWasteReport(user, query);
  }
}
