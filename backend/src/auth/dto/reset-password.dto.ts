import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    description: 'Reset token issued by forgot-password.',
  })
  @IsString()
  @Length(1, 256)
  token!: string;

  @ApiProperty({ example: 'N3wSup3rSecret!' })
  @IsString()
  @Length(8, 72)
  newPassword!: string;
}
