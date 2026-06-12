import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export const CATALOG_ITEM_STATUSES = ['active', 'archived'] as const;

export class ListCatalogQueryDto {
  @ApiPropertyOptional({ example: 'active', enum: CATALOG_ITEM_STATUSES })
  @IsOptional()
  @IsIn(CATALOG_ITEM_STATUSES)
  status?: (typeof CATALOG_ITEM_STATUSES)[number];

  @ApiPropertyOptional({ example: 'rau' })
  @IsOptional()
  @IsString()
  search?: string;
}
