import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { CryptoUtil } from '@utils/crypto.util';
import { EmailUtil } from 'src/utils/email.util';

import { Chat, ChatSchema } from './chat.schema';
import { ChatService } from './chat.service';

@Module({
  providers: [ChatService, CryptoUtil, EmailUtil],
  exports: [ChatService],
  imports: [
    JwtModule.register({
      secret: 'secretKey',
      signOptions: {
        expiresIn: 7 * 24 * 60 * 60,
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
  ],
})
export class ChatModule {}
