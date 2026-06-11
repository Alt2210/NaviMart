import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsIn,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { FOOD_STORAGE_LOCATIONS } from '../../catalog/schemas/food.schema';

export class CompleteShoppingListPantryItemDto {
  @ApiPropertyOptional({ example: '665f7b1e7c7a8f93df38b333' })
  @IsMongoId()
  itemId!: string;

  @ApiPropertyOptional({ example: '2026-06-18T00:00:00.000Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiryDate?: Date;

  @ApiPropertyOptional({ example: 'fridge', enum: FOOD_STORAGE_LOCATIONS })
  @IsOptional()
  @IsIn(FOOD_STORAGE_LOCATIONS)
  location?: (typeof FOOD_STORAGE_LOCATIONS)[number];

  @ApiPropertyOptional({ example: 'Da mua o sieu thi' })
  @IsOptional()
  @IsString()
  @Length(1, 300)
  note?: string;
}

export class CompleteShoppingListDto {
  @ApiPropertyOptional({
    type: [CompleteShoppingListPantryItemDto],
    description:
      'Optional pantry metadata per checked item. If omitted, backend uses food catalog defaults or fallback values.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompleteShoppingListPantryItemDto)
  pantryItems?: CompleteShoppingListPantryItemDto[];

  @ApiPropertyOptional({ example: 7 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(365)
  defaultExpiryDays?: number;

  @ApiPropertyOptional({ example: 'fridge', enum: FOOD_STORAGE_LOCATIONS })
  @IsOptional()
  @IsIn(FOOD_STORAGE_LOCATIONS)
  defaultLocation?: (typeof FOOD_STORAGE_LOCATIONS)[number];
}
