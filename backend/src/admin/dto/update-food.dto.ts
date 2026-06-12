import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { FOOD_STATUSES } from '../../catalog/schemas/food.schema';
import { CreateFoodDto } from './create-food.dto';

export class UpdateFoodDto extends PartialType(CreateFoodDto) {
  @ApiPropertyOptional({ example: 'active', enum: FOOD_STATUSES })
  @IsOptional()
  @IsIn(FOOD_STATUSES)
  status?: (typeof FOOD_STATUSES)[number];
}
