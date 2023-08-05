import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from 'nest-redis';

import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { ApiUserController } from './controller/api/user.controller';
import { CMSAdminController } from './controller/cms/admin.controller';
import { CMSUserController } from './controller/cms/user.controller';
import { InitModule } from './init/init.module';
import { AdminModule } from './module/admin/admin.module';
import { UserModule } from './module/user/user.module';
import { CryptoUtil } from './utils/crypto.util';
import { EmailUtil } from './utils/email.util';

@Module({
  imports: [
    AuthModule,
    InitModule,
    AdminModule,
    UserModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.redis,
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.mongodb,
      inject: [ConfigService],
    }),
  ],
  providers: [CryptoUtil, EmailUtil],
  controllers: [CMSAdminController, CMSUserController, ApiUserController],
})
export class AppModule {}
