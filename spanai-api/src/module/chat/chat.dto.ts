import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsString } from 'class-validator';

export class CreateChatDTO {
  @IsMongoId()
  @Type(() => String)
  @ApiProperty({ description: '聊天名称' })
  readonly name: string;

  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '聊天类型' })
  readonly type: string;
}
