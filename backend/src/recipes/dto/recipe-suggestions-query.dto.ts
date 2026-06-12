import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class RecipeSuggestionsQueryDto {
  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @ApiPropertyOptional({
    example: 0.5,
    description: 'Minimum matched/total ingredient ratio (0-1).',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  minMatch?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Rank recipes using soon-to-expire pantry items higher.',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  prioritizeExpiring?: boolean;
}
