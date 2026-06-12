import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({
    example: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    description: 'Verification token issued by send-verification.',
  })
  @IsString()
  @Length(1, 256)
  token!: string;
}
