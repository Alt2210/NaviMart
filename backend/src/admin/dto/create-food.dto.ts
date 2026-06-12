import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';
import { FOOD_STORAGE_LOCATIONS } from '../../catalog/schemas/food.schema';

export class CreateFoodDto {
  @ApiProperty({ example: 'Thit bo' })
  @IsString()
  @Length(1, 150)
  name!: string;

  @ApiProperty({ example: '665f7b1e7c7a8f93df38b222' })
  @IsMongoId()
  categoryId!: string;

  @ApiProperty({ example: 'kg' })
  @IsString()
  @Length(1, 30)
  defaultUnit!: string;

  @ApiPropertyOptional({ example: ['bo', 'beef'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  aliases?: string[];

  @ApiPropertyOptional({ example: 'fridge', enum: FOOD_STORAGE_LOCATIONS })
  @IsOptional()
  @IsIn(FOOD_STORAGE_LOCATIONS)
  defaultStorageLocation?: (typeof FOOD_STORAGE_LOCATIONS)[number];

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  defaultShelfLifeDays?: number;

  @ApiPropertyOptional({ example: 'Bao quan ngan mat 0-4 do C.' })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  storageTips?: string;

  @ApiPropertyOptional({ example: '8934673009012' })
  @IsOptional()
  @IsString()
  @Length(1, 64)
  barcode?: string;

  @ApiPropertyOptional({ example: 'https://example.com/beef.jpg' })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
