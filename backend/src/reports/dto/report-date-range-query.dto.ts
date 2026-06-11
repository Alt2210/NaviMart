import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class ReportDateRangeQueryDto {
  @ApiProperty({ example: '2026-06-01T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @ApiProperty({ example: '2026-06-30T23:59:59.999Z' })
  @Type(() => Date)
  @IsDate()
  endDate!: Date;
}
