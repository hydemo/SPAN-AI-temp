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
import { CMSAssistantsController } from './controller/cms/assistant.controller';
import { CMSChatController } from './controller/cms/chat.controller';
import { CMSConversationController } from './controller/cms/conversation';
import { CMSGPTFileController } from './controller/cms/gptFile.controller';
import { CMSUserController } from './controller/cms/user.controller';
import { CMSUserAssistantsController } from './controller/cms/userAssistant.controller';
import { InitModule } from './init/init.module';
import { AdminModule } from './module/admin/admin.module';
import { AIHandlerModule } from './module/AIHandler/AIHandler.module';
import { AssistantModule } from './module/assistant/assistant.module';
import { ChatModule } from './module/chat/chat.module';
import { ConversationModule } from './module/conversation/conversation.module';
import { GPTFileModule } from './module/gptFile/gptFile.module';
import { UserModule } from './module/user/user.module';
import { UserAssistantsModule } from './module/userAssistant/userAssistant.module';
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
    GPTFileModule,
    AssistantModule,
    UserAssistantsModule,
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
    CMSGPTFileController,
    CMSAssistantsController,
    CMSUserAssistantsController,
    ApiUserController,
    ApiChatController,
    ApiConversationController,
  ],
})
export class AppModule {}
