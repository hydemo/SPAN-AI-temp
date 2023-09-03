import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsNumber, IsString } from 'class-validator';

export class CreateConversationDTO {
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

  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '发送方', enum: ['assistant', 'user'] })
  readonly role: 'assistant' | 'user';

  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '模型' })
  readonly model: string;

  @IsMongoId()
  @Type(() => String)
  @ApiProperty({ description: '父级' })
  readonly parent: string;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: '当前会话消的prompt token数' })
  readonly promptTokens?: string;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: '当前会话消耗总的token数' })
  readonly totalTokens?: string;
}

export class UpdateConversationDTO {
  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '标题' })
  readonly title: string;
}

export class SendMessageDTO {
  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '用户' })
  readonly content: string;

  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '模型' })
  readonly model: string;

  @IsMongoId()
  @Type(() => String)
  @ApiProperty({ description: '父级' })
  readonly parent: string;

  @IsMongoId()
  @Type(() => String)
  @ApiProperty({ description: '聊天Id' })
  readonly chatId: string;
}
