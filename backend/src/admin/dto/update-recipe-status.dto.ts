import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, Length } from 'class-validator';

export const RECIPE_MODERATION_STATUSES = ['approved', 'rejected'] as const;

export class UpdateRecipeStatusDto {
  @ApiProperty({ example: 'approved', enum: RECIPE_MODERATION_STATUSES })
  @IsIn(RECIPE_MODERATION_STATUSES)
  status!: (typeof RECIPE_MODERATION_STATUSES)[number];

  @ApiPropertyOptional({ example: 'Thieu thong tin so che nguyen lieu.' })
  @IsOptional()
  @IsString()
  @Length(1, 300)
  note?: string;
}
