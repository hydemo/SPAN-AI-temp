import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { CryptoUtil } from '@utils/crypto.util';
import { EmailUtil } from 'src/utils/email.util';

import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';

@Module({
  providers: [UserService, CryptoUtil, EmailUtil],
  exports: [UserService],
  imports: [
    JwtModule.register({
      secret: 'secretKey',
      signOptions: {
        expiresIn: 7 * 24 * 60 * 60,
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class UserModule {}
