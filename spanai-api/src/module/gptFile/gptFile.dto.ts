import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateGPTFileDTO {
  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '文件名' })
  readonly filename: string;

  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '名称' })
  readonly name: string;
}
