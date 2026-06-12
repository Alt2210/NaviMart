import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: '123456',
    description: 'Reset code issued by forgot-password.',
  })
  @IsString()
  @Length(1, 256)
  token!: string;

  @ApiProperty({ example: 'N3wSup3rSecret!' })
  @IsString()
  @Length(8, 72)
  newPassword!: string;
}
