import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';

export class RegisterDto {
  @ApiPropertyOptional({ example: 'linh@example.com' })
  @ValidateIf((dto: RegisterDto) => !dto.phone)
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+84901234567' })
  @ValidateIf((dto: RegisterDto) => !dto.email)
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

  @ApiPropertyOptional({ example: 'Gia dinh Linh' })
  @IsOptional()
  @IsString()
  @Length(1, 120)
  familyName?: string;
}
