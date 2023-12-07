import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IAssistant = Assistant & Document & { createdAt: Date };

@Schema({ timestamps: true })
export class Assistant {
  // id
  @Prop()
  files: string[];
  // 名称
  @Prop()
  name: string;
  // 名称
  @Prop()
  model: string;
  // 名称
  @Prop()
  instructions: string;
  // 名称
  @Prop()
  assistantId: string;
  // 名称
  @Prop({})
  tools: any[];
  // expire
  @Prop({})
  expireTime: number;
}

export const AssistantSchema = SchemaFactory.createForClass(Assistant);
