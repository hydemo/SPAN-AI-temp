import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsEmail, IsNumber } from 'class-validator';

export class CreateAdminDTO {
  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '昵称' })
  readonly username: string;

  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '密码' })
  password: string;

  @IsEmail()
  @Type(() => String)
  @ApiProperty({ description: '邮箱' })
  email: string;

  @IsString()
  @Type(() => String)
  @ApiPropertyOptional({ description: '联系电话' })
  phone?: string;

  @IsString()
  @ApiPropertyOptional({ description: '头像' })
  readonly avatar?: string;

  @IsNumber()
  @ApiProperty({ description: '权限' })
  role: number;

  @IsNumber()
  @ApiPropertyOptional({ description: '注册时间' })
  registerTime?: number;
}

export class UpdateAdminPassDTO {
  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '密码' })
  password: string;
}

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

export class CodeVerifyDTO {
  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '用户名' })
  readonly username: string;

  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '验证吗' })
  readonly code: string;
}

export class ResetPassDTO {
  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '用户名' })
  readonly username: string;

  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '新密码' })
  readonly password: string;

  @IsString()
  @Type(() => String)
  @ApiProperty({ description: 'token' })
  readonly token: string;
}

export class NewPassDTO {
  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '用户名' })
  readonly username: string;

  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '新密码' })
  readonly newPass: string;

  @IsString()
  @Type(() => String)
  @ApiProperty({ description: '旧密码' })
  readonly oldPass: string;
}
