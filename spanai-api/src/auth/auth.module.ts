import { Module } from '@nestjs/common';
import { AdminModule } from 'src/module/admin/admin.module';
import { UserModule } from 'src/module/user/user.module';

import { AuthService } from './auth.service';
import { AuthStrategy } from './auth.strategy';

@Module({
  providers: [AuthService, AuthStrategy],
  imports: [UserModule, AdminModule],
})
export class AuthModule {}
