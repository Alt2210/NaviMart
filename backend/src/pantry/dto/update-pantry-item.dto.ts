import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { FOOD_STORAGE_LOCATIONS } from '../../catalog/schemas/food.schema';
import { PANTRY_ITEM_STATUSES } from '../schemas/pantry-item.schema';

export class UpdatePantryItemDto {
  @ApiPropertyOptional({ example: '665f7b1e7c7a8f93df38b111' })
  @IsOptional()
  @IsMongoId()
  foodId?: string;

  @ApiPropertyOptional({ example: '665f7b1e7c7a8f93df38b222' })
  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'Sua tuoi' })
  @IsOptional()
  @IsString()
  @Length(1, 150)
  name?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({ example: 'hop' })
  @IsOptional()
  @IsString()
  @Length(1, 30)
  unit?: string;

  @ApiPropertyOptional({ example: '2026-06-18T00:00:00.000Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiryDate?: Date;

  @ApiPropertyOptional({ example: 'fridge', enum: FOOD_STORAGE_LOCATIONS })
  @IsOptional()
  @IsIn(FOOD_STORAGE_LOCATIONS)
  location?: (typeof FOOD_STORAGE_LOCATIONS)[number];

  @ApiPropertyOptional({ example: 'active', enum: PANTRY_ITEM_STATUSES })
  @IsOptional()
  @IsIn(PANTRY_ITEM_STATUSES)
  status?: (typeof PANTRY_ITEM_STATUSES)[number];

  @ApiPropertyOptional({ example: 'Sap het han, uu tien dung truoc' })
  @IsOptional()
  @IsString()
  @Length(1, 300)
  note?: string;
}
