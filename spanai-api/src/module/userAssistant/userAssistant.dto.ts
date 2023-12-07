import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsString } from 'class-validator';

import { CreateGPTFileDTO } from '../gptFile/gptFile.dto';

export class CreateUserAssistantsDTO {
  @IsMongoId()
  @Type(() => String)
  @ApiProperty({ description: '用户' })
  readonly user: string;

  @IsMongoId()
  @Type(() => String)
  @ApiProperty({ description: '助理' })
  readonly assistant: string;
}

export class AssistantMessageDTO {
  @IsMongoId()
  @Type(() => String)
  @ApiProperty({ description: '助理id' })
  readonly assistant: string;

  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '消息' })
  readonly content: string;

  @IsMongoId()
  @Type(() => String)
  @ApiProperty({ description: '助理id' })
  readonly parent?: string;
}

export class CreateUserAssistantsByUserDTO {
  @IsString({ each: true })
  @Type(() => String)
  @ApiProperty({ description: '文件集' })
  readonly files: CreateGPTFileDTO[];

  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '名称' })
  readonly name: string;

  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '介绍' })
  readonly instructions: string;

  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '模型' })
  readonly model: string;

  @IsString({ each: true })
  @Type(() => String)
  @ApiProperty({ description: '工具集' })
  readonly tools: any[];
}
