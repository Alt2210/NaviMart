import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateIf,
} from 'class-validator';

export class RecipeIngredientDto {
  @ApiPropertyOptional({ example: '665f7b1e7c7a8f93df38b111' })
  @IsOptional()
  @IsMongoId()
  foodId?: string;

  @ApiPropertyOptional({ example: '665f7b1e7c7a8f93df38b222' })
  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'Thit bo' })
  @ValidateIf((dto: RecipeIngredientDto) => !dto.foodId)
  @IsString()
  @Length(1, 150)
  name?: string;

  @ApiProperty({ example: 0.5 })
  @IsNumber()
  @Min(0.01)
  quantity!: number;

  @ApiPropertyOptional({ example: 'kg' })
  @ValidateIf((dto: RecipeIngredientDto) => !dto.foodId)
  @IsString()
  @Length(1, 30)
  unit?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  optional?: boolean;
}
