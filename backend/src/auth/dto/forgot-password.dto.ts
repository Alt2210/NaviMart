import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'linh@example.com',
    description: 'Email or phone of the account.',
  })
  @IsString()
  @Length(3, 150)
  identifier!: string;
}
