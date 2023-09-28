import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AIHandlerModule } from '../AIHandler/AIHandler.module';

import { Summary, SummarySchema } from './summary.schema';
import { SummaryService } from './summary.service';

@Module({
  providers: [SummaryService],
  exports: [SummaryService],
  imports: [AIHandlerModule, MongooseModule.forFeature([{ name: Summary.name, schema: SummarySchema }])],
})
export class SummaryModule {}
