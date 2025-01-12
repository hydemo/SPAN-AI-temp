import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IUser = User & Document & { isMock: boolean };

@Schema({ timestamps: true })
export class User {
  // 用户名
  @Prop()
  username: string;
  // 手机号
  @Prop()
  phone: string;
  // 密码
  @Prop()
  password: string;
  // 邮箱
  @Prop()
  email: string;
  // 头像
  @Prop()
  avatar: string;
  // 当前模型
  @Prop()
  model: string;
  // 支持模型
  @Prop([String])
  models: string[];
  // 过期时间
  @Prop()
  expired: string;
  @Prop()
  singleQuestionToken: number;
  @Prop()
  singleChatToken: number;
  @Prop()
  questionCount: number;
  @Prop()
  usedPromptTokens: number;
  @Prop()
  usedTotalTokens: number;
  @Prop()
  lastModel: string;
  @Prop({ default: false })
  isDelete: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
