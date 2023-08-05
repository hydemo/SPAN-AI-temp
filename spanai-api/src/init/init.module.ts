import { Module, Global } from '@nestjs/common';
import { AdminModule } from 'src/module/admin/admin.module';

import { InitService } from './init.service';

@Global()
@Module({
  providers: [InitService],
  imports: [AdminModule],
  exports: [InitService],
})
export class InitModule {}
