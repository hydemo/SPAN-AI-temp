import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AIHandlerModule } from '../AIHandler/AIHandler.module';
import { GPTFileModule } from '../gptFile/gptFile.module';

import { Assistant, AssistantSchema } from './assistant.schema';
import { AssistantService } from './assistant.service';

@Module({
  providers: [AssistantService],
  exports: [AssistantService],
  imports: [
    AIHandlerModule,
    GPTFileModule,
    MongooseModule.forFeature([{ name: Assistant.name, schema: AssistantSchema }]),
  ],
})
export class AssistantModule {}
