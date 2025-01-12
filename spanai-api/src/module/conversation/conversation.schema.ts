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
  // 聊天窗口
  @Prop()
  assistant: string;
  // 对话内容
  @Prop()
  content: string;
  // 发送人 assistant user
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
  // prompt token数量
  @Prop()
  promptTokens: number;
  // 类型：conversion image code
  @Prop({ default: 'conversation' })
  type: string;
  // 总token数量
  @Prop()
  totalTokens: number;
  // 提问时间
  @Prop()
  questionTime: Date;
  // 回复时间
  @Prop()
  answerTime: number;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
