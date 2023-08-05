import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsString } from 'class-validator';

export class CreateConversationDTO {
  @IsMongoId()
  @Type(() => String)
  @ApiProperty({ description: '用户' })
  readonly user: string;
}

export class UpdateConversationDTO {
  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '标题' })
  readonly title: string;
}
