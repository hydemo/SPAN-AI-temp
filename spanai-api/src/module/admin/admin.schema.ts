import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IAdmin = Admin & Document;

@Schema({ timestamps: true })
export class Admin {
  // 昵称
  @Prop()
  username: string;
  // 密码
  @Prop()
  password: string;
  // 邮箱
  @Prop({ unique: true })
  email: string;
  // 权限
  @Prop()
  role: number;
  // 手机
  @Prop()
  phone: string;
  // 头像
  @Prop()
  avatar: string;
  // 最后登录时间
  @Prop()
  lastLoginTime: Date;
  // 最后登录ip
  @Prop()
  lastLoginIp: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
