import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ISummary = Summary & Document & { isMock: boolean };

@Schema({ timestamps: true })
export class Summary {
  // 用户
  @Prop()
  user: string;
  // 聊天窗口
  @Prop()
  chat: string;
  // 对话内容
  @Prop()
  content: string;
  // 总结的index
  @Prop()
  index: number;
}

export const SummarySchema = SchemaFactory.createForClass(Summary);
