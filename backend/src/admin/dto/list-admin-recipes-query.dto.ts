import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { RECIPE_STATUSES } from '../../recipes/schemas/recipe.schema';

export class ListAdminRecipesQueryDto {
  @ApiPropertyOptional({ example: 'pending', enum: RECIPE_STATUSES })
  @IsOptional()
  @IsIn(RECIPE_STATUSES)
  status?: (typeof RECIPE_STATUSES)[number];

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
