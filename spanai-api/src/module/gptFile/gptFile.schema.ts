import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IGPTFile = GPTFile & Document & { isMock: boolean };

@Schema({ timestamps: true })
export class GPTFile {
  // id
  @Prop()
  fileId: string;
  // 名称
  @Prop()
  name: string;
}

export const GPTFileSchema = SchemaFactory.createForClass(GPTFile);
