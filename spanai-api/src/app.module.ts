import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from 'nest-redis';

import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { ApiChatController } from './controller/api/chat.controller';
import { ApiConversationController } from './controller/api/conversation';
import { ApiUserController } from './controller/api/user.controller';
import { CMSAdminController } from './controller/cms/admin.controller';
import { CMSChatController } from './controller/cms/chat.controller';
import { CMSConversationController } from './controller/cms/conversation';
import { CMSUserController } from './controller/cms/user.controller';
import { InitModule } from './init/init.module';
import { AdminModule } from './module/admin/admin.module';
import { AIHandlerModule } from './module/AIHandler/AIHandler.module';
import { ChatModule } from './module/chat/chat.module';
import { ConversationModule } from './module/conversation/conversation.module';
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
    AIHandlerModule,
    ChatModule,
    ConversationModule,
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
  controllers: [
    CMSAdminController,
    CMSUserController,
    CMSChatController,
    CMSConversationController,
    ApiUserController,
    ApiChatController,
    ApiConversationController,
  ],
})
export class AppModule {}
