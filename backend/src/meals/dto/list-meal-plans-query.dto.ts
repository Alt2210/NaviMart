import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsIn, IsOptional } from 'class-validator';
import { MEAL_SESSIONS } from '../schemas/meal-plan.schema';

export class ListMealPlansQueryDto {
  @ApiProperty({ example: '2026-06-11T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @ApiProperty({ example: '2026-06-18T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  endDate!: Date;

  @ApiPropertyOptional({ example: 'dinner', enum: MEAL_SESSIONS })
  @IsOptional()
  @IsIn(MEAL_SESSIONS)
  session?: (typeof MEAL_SESSIONS)[number];
}
