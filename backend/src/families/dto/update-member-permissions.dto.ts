import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsOptional } from 'class-validator';
import {
  FAMILY_MEMBER_ROLES,
  FAMILY_PERMISSIONS,
} from '../schemas/family.schema';

export class UpdateMemberPermissionsDto {
  @ApiProperty({
    example: ['edit_lists', 'edit_pantry'],
    enum: FAMILY_PERMISSIONS,
    isArray: true,
  })
  @IsArray()
  @IsIn(FAMILY_PERMISSIONS, { each: true })
  permissions!: Array<(typeof FAMILY_PERMISSIONS)[number]>;

  @ApiPropertyOptional({ example: 'member', enum: FAMILY_MEMBER_ROLES })
  @IsOptional()
  @IsIn(FAMILY_MEMBER_ROLES)
  role?: (typeof FAMILY_MEMBER_ROLES)[number];
}
