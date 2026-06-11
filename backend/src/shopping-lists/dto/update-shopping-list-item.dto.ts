import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { SHOPPING_ITEM_STATUSES } from '../schemas/shopping-list.schema';

export class UpdateShoppingListItemDto {
  @ApiPropertyOptional({ example: '665f7b1e7c7a8f93df38b111' })
  @IsOptional()
  @IsMongoId()
  foodId?: string;

  @ApiPropertyOptional({ example: '665f7b1e7c7a8f93df38b222' })
  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'Ca rot' })
  @IsOptional()
  @IsString()
  @Length(1, 150)
  name?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  quantity?: number;

  @ApiPropertyOptional({ example: 'cu' })
  @IsOptional()
  @IsString()
  @Length(1, 30)
  unit?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  checked?: boolean;

  @ApiPropertyOptional({ example: 'bought', enum: SHOPPING_ITEM_STATUSES })
  @IsOptional()
  @IsIn(SHOPPING_ITEM_STATUSES)
  status?: (typeof SHOPPING_ITEM_STATUSES)[number];

  @ApiPropertyOptional({ example: 'Mua loai huu co' })
  @IsOptional()
  @IsString()
  @Length(1, 300)
  note?: string;
}
