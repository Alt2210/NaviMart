import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class GenerateShoppingListDto {
  @ApiPropertyOptional({ example: 'Nguyen lieu bua toi' })
  @IsOptional()
  @IsString()
  @Length(1, 120)
  name?: string;

  @ApiPropertyOptional({ example: '2026-06-12T00:00:00.000Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  plannedFor?: Date;

  @ApiPropertyOptional({
    example: 2,
    description: 'Only used when generating from a recipe directly.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  servings?: number;
}
