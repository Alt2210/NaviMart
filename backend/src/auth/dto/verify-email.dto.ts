import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({
    example: '123456',
    description: 'Verification code issued by send-verification.',
  })
  @IsString()
  @Length(1, 256)
  token!: string;
}
