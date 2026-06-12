import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { CATEGORY_STATUSES } from '../../catalog/schemas/category.schema';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiPropertyOptional({ example: 'active', enum: CATEGORY_STATUSES })
  @IsOptional()
  @IsIn(CATEGORY_STATUSES)
  status?: (typeof CATEGORY_STATUSES)[number];
}
