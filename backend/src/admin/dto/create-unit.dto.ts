import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, Length } from 'class-validator';
import { UNIT_TYPES } from '../../catalog/schemas/unit.schema';

export class CreateUnitDto {
  @ApiProperty({ example: 'kg' })
  @IsString()
  @Length(1, 30)
  code!: string;

  @ApiProperty({ example: 'Kilogram' })
  @IsString()
  @Length(1, 80)
  name!: string;

  @ApiProperty({ example: 'weight', enum: UNIT_TYPES })
  @IsIn(UNIT_TYPES)
  type!: (typeof UNIT_TYPES)[number];
}
