import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IConversation = Conversation & Document & { isMock: boolean };

@Schema({ timestamps: true })
export class Conversation {
  // 用户
  @Prop()
  user: string;
  // 聊天窗口
  @Prop()
  chat: string;
  // 对话内容
  @Prop()
  content: string;
  // 发送人 system user
  @Prop()
  role: string;
  // 模型
  @Prop()
  model: string;
  // 模型
  @Prop({ default: 0 })
  version: number;
  // 父级
  @Prop()
  parent: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);