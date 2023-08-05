import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsEmail, IsNumber } from 'class-validator';

export class LoginDTO {
  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '用户名' })
  readonly username: string;

  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '密码' })
  password: string;
}

export class UpdateUserDTO {
  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '用户名' })
  readonly username: string;

  @IsEmail()
  @Type(() => String)
  @ApiProperty({ description: '邮箱' })
  readonly email: string;

  @IsString({ each: true })
  @Type(() => String)
  @ApiProperty({ description: '可用模型' })
  readonly models: string[];

  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '过期时间' })
  readonly expired: string;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: '单个问题token数量' })
  readonly singleQuestionToken: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: '提问数量' })
  readonly questionCount: number;
}

export class CreateUserDTO extends UpdateUserDTO {
  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '密码' })
  readonly password: string;
}
