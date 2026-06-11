import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { FAMILY_PERMISSIONS } from '../schemas/family.schema';

export class CreateFamilyInviteDto {
  @ApiPropertyOptional({
    example: ['edit_lists', 'edit_pantry'],
    enum: FAMILY_PERMISSIONS,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsIn(FAMILY_PERMISSIONS, { each: true })
  permissions?: Array<(typeof FAMILY_PERMISSIONS)[number]>;

  @ApiPropertyOptional({ example: 24 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(168)
  expiresInHours?: number;
}
