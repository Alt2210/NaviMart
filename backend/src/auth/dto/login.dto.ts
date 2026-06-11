import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'linh@example.com' })
  @IsString()
  @Length(3, 150)
  identifier!: string;

  @ApiProperty({ example: 'Sup3rSecret!' })
  @IsString()
  @Length(8, 72)
  password!: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  rememberMe?: boolean;
}
