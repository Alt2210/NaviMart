import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
} from 'class-validator';
import { USER_GENDERS } from '../schemas/user.schema';

export class UpdateProfileDto {
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

  @ApiPropertyOptional({ example: 'https://example.com/avatar.png' })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: '1990-05-20T00:00:00.000Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateOfBirth?: Date;

  @ApiPropertyOptional({ example: 'female', enum: USER_GENDERS })
  @IsOptional()
  @IsIn(USER_GENDERS)
  gender?: (typeof USER_GENDERS)[number];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  expiryReminder?: boolean;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(30)
  expiryReminderDays?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  shoppingReminder?: boolean;
}
