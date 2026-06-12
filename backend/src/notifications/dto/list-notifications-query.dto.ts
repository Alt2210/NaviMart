import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';

export class ListNotificationsQueryDto {
  @ApiPropertyOptional({ example: false })
  @IsOptional()
  // Type(() => Boolean) would turn the query string 'false' into true.
  @Transform(({ value }) =>
    value === undefined ? undefined : value === true || value === 'true' || value === '1',
  )
  @IsBoolean()
  unreadOnly?: boolean;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
