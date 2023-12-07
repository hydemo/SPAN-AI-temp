import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IUserAssistants = UserAssistants & Document & { isMock: boolean };

@Schema({ timestamps: true })
export class UserAssistants {
  // 用户
  @Prop()
  user: string;
  // 助理
  @Prop()
  assistant: string;
  // 密码
  @Prop({ default: 0 })
  conversationCount: number;
}

export const UserAssistantsSchema = SchemaFactory.createForClass(UserAssistants);
