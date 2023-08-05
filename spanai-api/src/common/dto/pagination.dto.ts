import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsOptional, IsString } from 'class-validator';

export class Pagination {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiPropertyOptional({ type: Number, example: 1 })
  @Type(() => Number)
  readonly current: number = 1;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiPropertyOptional({ type: Number, example: 10 })
  @Type(() => Number)
  readonly pageSize: number = 10;

  @IsString()
  readonly search?: string;

  @IsString()
  @Type(() => String)
  @IsOptional()
  @ApiPropertyOptional({ description: '搜索参数' })
  readonly value?: string;
}
