import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateChatDTO {
  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '聊天名称' })
  readonly name: string;

  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '聊天类型' })
  readonly type: string;
}
