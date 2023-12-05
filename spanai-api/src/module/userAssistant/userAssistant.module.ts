import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AIHandlerModule } from '../AIHandler/AIHandler.module';

import { UserAssistants, UserAssistantsSchema } from './userAssistant.schema';
import { UserAssistantsService } from './userAssistant.service';

@Module({
  providers: [UserAssistantsService],
  exports: [UserAssistantsService],
  imports: [AIHandlerModule, MongooseModule.forFeature([{ name: UserAssistants.name, schema: UserAssistantsSchema }])],
})
export class UserAssistantsModule {}
