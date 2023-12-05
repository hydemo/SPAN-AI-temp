import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AIHandlerModule } from '../AIHandler/AIHandler.module';

import { GPTFile, GPTFileSchema } from './gptFile.schema';
import { GPTFileService } from './gptFile.service';

@Module({
  providers: [GPTFileService],
  exports: [GPTFileService],
  imports: [AIHandlerModule, MongooseModule.forFeature([{ name: GPTFile.name, schema: GPTFileSchema }])],
})
export class GPTFileModule {}
