import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class JoinFamilyDto {
  @ApiProperty({ example: 'ABCD-EFGH' })
  @IsString()
  @Length(6, 64)
  inviteCode!: string;
}
