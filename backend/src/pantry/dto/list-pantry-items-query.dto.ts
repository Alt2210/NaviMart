import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { FOOD_STORAGE_LOCATIONS } from '../../catalog/schemas/food.schema';
import { PANTRY_ITEM_STATUSES } from '../schemas/pantry-item.schema';
import { EXPIRY_STATUSES } from '../utils/expiry-status.util';
import type { ExpiryStatus } from '../utils/expiry-status.util';

export class ListPantryItemsQueryDto {
  @ApiPropertyOptional({ example: 'fridge', enum: FOOD_STORAGE_LOCATIONS })
  @IsOptional()
  @IsIn(FOOD_STORAGE_LOCATIONS)
  location?: (typeof FOOD_STORAGE_LOCATIONS)[number];

  @ApiPropertyOptional({ example: '665f7b1e7c7a8f93df38b222' })
  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'active', enum: PANTRY_ITEM_STATUSES })
  @IsOptional()
  @IsIn(PANTRY_ITEM_STATUSES)
  status?: (typeof PANTRY_ITEM_STATUSES)[number];

  @ApiPropertyOptional({ example: 'expiring', enum: EXPIRY_STATUSES })
  @IsOptional()
  @IsIn(EXPIRY_STATUSES)
  expiryStatus?: ExpiryStatus;

  @ApiPropertyOptional({
    example: 3,
    description:
      'Number of days from today that should be treated as expiring. Defaults to 3.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(30)
  expiryWarningDays?: number;

  @ApiPropertyOptional({ example: 'thit' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ example: '2026-06-11T00:00:00.000Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fromExpiryDate?: Date;

  @ApiPropertyOptional({ example: '2026-06-18T00:00:00.000Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  toExpiryDate?: Date;
}
