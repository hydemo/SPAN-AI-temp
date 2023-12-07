import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsString } from 'class-validator';

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
}
