import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { USER_ROLES, USER_STATUSES } from '../../users/schemas/user.schema';

export class CreateUserDto {
  @ApiPropertyOptional({ example: 'linh@example.com' })
  @ValidateIf((dto: CreateUserDto) => !dto.phone)
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+84901234567' })
  @ValidateIf((dto: CreateUserDto) => !dto.email)
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({ example: 'Sup3rSecret!' })
  @IsString()
  @Length(8, 72)
  password!: string;

  @ApiProperty({ example: 'Linh' })
  @IsString()
  @Length(1, 80)
  firstName!: string;

  @ApiProperty({ example: 'Nguyen' })
  @IsString()
  @Length(1, 80)
  lastName!: string;

  @ApiPropertyOptional({ example: 'Linh Nguyen' })
  @IsOptional()
  @IsString()
  @Length(1, 160)
  displayName?: string;

  @ApiPropertyOptional({ example: 'member', enum: USER_ROLES })
  @IsOptional()
  @IsIn(USER_ROLES)
  role?: (typeof USER_ROLES)[number];

  @ApiPropertyOptional({ example: 'active', enum: USER_STATUSES })
  @IsOptional()
  @IsIn(USER_STATUSES)
  status?: (typeof USER_STATUSES)[number];
}
