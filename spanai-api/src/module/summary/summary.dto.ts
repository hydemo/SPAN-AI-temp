import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsNumber, IsString } from 'class-validator';

export class CreateSummaryDTO {
  @IsMongoId()
  @Type(() => String)
  @ApiProperty({ description: '用户' })
  readonly user: string;

  @IsMongoId()
  @Type(() => String)
  @ApiProperty({ description: '聊天窗口' })
  readonly chat: string;

  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '用户' })
  readonly content: string;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: '总结的index' })
  readonly index: number;
}
