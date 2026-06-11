import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateFamilyDto {
  @ApiProperty({ example: 'Gia dinh NaviMart' })
  @IsString()
  @Length(1, 120)
  name!: string;
}
