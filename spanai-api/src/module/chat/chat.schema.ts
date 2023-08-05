import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IChat = Chat & Document & { isMock: boolean };

@Schema({ timestamps: true })
export class Chat {
  // 用户名
  @Prop()
  user: string;
  // 密码
  @Prop()
  name: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);