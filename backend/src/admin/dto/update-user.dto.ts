import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { USER_ROLES, USER_STATUSES } from '../../users/schemas/user.schema';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Linh' })
  @IsOptional()
  @IsString()
  @Length(1, 80)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Nguyen' })
  @IsOptional()
  @IsString()
  @Length(1, 80)
  lastName?: string;

  @ApiPropertyOptional({ example: 'Linh Nguyen' })
  @IsOptional()
  @IsString()
  @Length(1, 160)
  displayName?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'Sup3rSecret!' })
  @IsOptional()
  @IsString()
  @Length(8, 72)
  password?: string;

  @ApiPropertyOptional({ example: 'member', enum: USER_ROLES })
  @IsOptional()
  @IsIn(USER_ROLES)
  role?: (typeof USER_ROLES)[number];

  @ApiPropertyOptional({ example: 'active', enum: USER_STATUSES })
  @IsOptional()
  @IsIn(USER_STATUSES)
  status?: (typeof USER_STATUSES)[number];
}
