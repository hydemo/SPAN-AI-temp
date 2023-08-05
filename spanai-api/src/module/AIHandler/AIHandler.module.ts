import { Module } from '@nestjs/common';

import { GPTService } from './GPT.service';

@Module({
  providers: [GPTService],
  exports: [GPTService],
  imports: [],
})
export class AIHandlerModule {}
