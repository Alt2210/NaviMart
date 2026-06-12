import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { USER_ROLES, USER_STATUSES } from '../../users/schemas/user.schema';

export class ListUsersQueryDto {
  @ApiPropertyOptional({ example: 'active', enum: USER_STATUSES })
  @IsOptional()
  @IsIn(USER_STATUSES)
  status?: (typeof USER_STATUSES)[number];

  @ApiPropertyOptional({ example: 'member', enum: USER_ROLES })
  @IsOptional()
  @IsIn(USER_ROLES)
  role?: (typeof USER_ROLES)[number];

  @ApiPropertyOptional({ example: 'linh' })
  @IsOptional()
  @IsString()
  search?: string;

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
