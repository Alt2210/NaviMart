import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsIn,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { MEAL_SESSIONS } from '../schemas/meal-plan.schema';

export class CreateMealPlanDto {
  @ApiProperty({ example: '2026-06-12T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  date!: Date;

  @ApiProperty({ example: 'dinner', enum: MEAL_SESSIONS })
  @IsIn(MEAL_SESSIONS)
  session!: (typeof MEAL_SESSIONS)[number];

  @ApiPropertyOptional({ example: 'Bua xe' })
  @ValidateIf((dto: CreateMealPlanDto) => dto.session === 'custom')
  @IsString()
  @Length(1, 80)
  customSessionName?: string;

  @ApiPropertyOptional({ example: '665f7b1e7c7a8f93df38b444' })
  @IsOptional()
  @IsMongoId()
  recipeId?: string;

  @ApiPropertyOptional({ example: 'Mi trung tu lam' })
  @ValidateIf((dto: CreateMealPlanDto) => !dto.recipeId)
  @IsString()
  @Length(1, 200)
  customName?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  servings?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @ApiPropertyOptional({ example: 'An kem salad' })
  @IsOptional()
  @IsString()
  @Length(1, 300)
  note?: string;
}
