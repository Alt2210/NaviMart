import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Min,
  ValidateIf,
} from 'class-validator';
import { FOOD_STORAGE_LOCATIONS } from '../../catalog/schemas/food.schema';
import { PANTRY_ITEM_SOURCES } from '../schemas/pantry-item.schema';

export class CreatePantryItemDto {
  @ApiPropertyOptional({ example: '665f7b1e7c7a8f93df38b111' })
  @IsOptional()
  @IsMongoId()
  foodId?: string;

  @ApiPropertyOptional({ example: '665f7b1e7c7a8f93df38b222' })
  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'Thit bo' })
  @ValidateIf((dto: CreatePantryItemDto) => !dto.foodId)
  @IsString()
  @Length(1, 150)
  name?: string;

  @ApiProperty({ example: 1.2 })
  @IsNumber()
  @Min(0)
  quantity!: number;

  @ApiPropertyOptional({ example: 'kg' })
  @ValidateIf((dto: CreatePantryItemDto) => !dto.foodId)
  @IsString()
  @Length(1, 30)
  unit?: string;

  @ApiProperty({ example: '2026-06-18T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  expiryDate!: Date;

  @ApiPropertyOptional({ example: 'fridge', enum: FOOD_STORAGE_LOCATIONS })
  @IsOptional()
  @IsIn(FOOD_STORAGE_LOCATIONS)
  location?: (typeof FOOD_STORAGE_LOCATIONS)[number];

  @ApiPropertyOptional({ example: 'manual', enum: PANTRY_ITEM_SOURCES })
  @IsOptional()
  @IsIn(PANTRY_ITEM_SOURCES)
  source?: (typeof PANTRY_ITEM_SOURCES)[number];

  @ApiPropertyOptional({ example: 'De ngan tren cung' })
  @IsOptional()
  @IsString()
  @Length(1, 300)
  note?: string;

  @ApiPropertyOptional({ example: 'https://res.cloudinary.com/demo/image/upload/item.jpg' })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
