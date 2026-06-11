import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';

export class ConsumePantryItemDto {
  @ApiProperty({ example: 0.2 })
  @IsNumber()
  @Min(0.01)
  quantity!: number;

  @ApiPropertyOptional({ example: 'Da nau bua toi' })
  @IsOptional()
  @IsString()
  @Length(1, 300)
  note?: string;
}
