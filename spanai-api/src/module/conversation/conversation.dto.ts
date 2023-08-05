import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsString } from 'class-validator';

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
  @ApiProperty({ description: '发送方', enum: ['system', 'user'] })
  readonly role: 'system' | 'user';

  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '模型' })
  readonly model: string;

  @IsMongoId()
  @Type(() => String)
  @ApiProperty({ description: '父级' })
  readonly parent: string;
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
}
