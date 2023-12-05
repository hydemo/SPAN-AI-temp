import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateAssistantDTO {
  @IsString({ each: true })
  @Type(() => String)
  @ApiProperty({ description: '文件集' })
  readonly files: string[];

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
