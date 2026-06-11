import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { SHOPPING_LIST_STATUSES } from '../schemas/shopping-list.schema';

export class ListShoppingListsQueryDto {
  @ApiPropertyOptional({ example: 'active', enum: SHOPPING_LIST_STATUSES })
  @IsOptional()
  @IsIn(SHOPPING_LIST_STATUSES)
  status?: (typeof SHOPPING_LIST_STATUSES)[number];
}
