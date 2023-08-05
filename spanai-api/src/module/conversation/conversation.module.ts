import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { CryptoUtil } from '@utils/crypto.util';
import { EmailUtil } from 'src/utils/email.util';

import { AIHandlerModule } from '../AIHandler/AIHandler.module';
import { ChatModule } from '../chat/chat.module';

import { Conversation, ConversationSchema } from './conversation.schema';
import { ConversationService } from './conversation.service';

@Module({
  providers: [ConversationService, CryptoUtil, EmailUtil],
  exports: [ConversationService],
  imports: [
    JwtModule.register({
      secret: 'secretKey',
      signOptions: {
        expiresIn: 7 * 24 * 60 * 60,
      },
    }),
    AIHandlerModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: Conversation.name, schema: ConversationSchema }]),
    ChatModule,
  ],
})
export class ConversationModule {}
