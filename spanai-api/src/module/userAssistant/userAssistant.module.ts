import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AIHandlerModule } from '../AIHandler/AIHandler.module';
import { AssistantModule } from '../assistant/assistant.module';
import { ConversationModule } from '../conversation/conversation.module';
import { GPTFileModule } from '../gptFile/gptFile.module';

import { UserAssistants, UserAssistantsSchema } from './userAssistant.schema';
import { UserAssistantsService } from './userAssistant.service';

@Module({
  providers: [UserAssistantsService],
  exports: [UserAssistantsService],
  imports: [
    AIHandlerModule,
    AssistantModule,
    ConversationModule,
    GPTFileModule,
    MongooseModule.forFeature([{ name: UserAssistants.name, schema: UserAssistantsSchema }]),
  ],
})
export class UserAssistantsModule {}
