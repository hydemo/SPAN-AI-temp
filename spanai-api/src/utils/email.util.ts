import * as util from 'util';

import { Injectable } from '@nestjs/common';
import { RedisService } from 'nest-redis';
import * as nodemail from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';
import * as randomize from 'randomatic';
import { ApiErrorCode } from 'src/common/enum/api-error-code.enum';
import { ApiException } from 'src/common/exception/api.exception';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class EmailUtil {
  constructor(private readonly config: ConfigService, private readonly redis: RedisService) {}
  /**
   *
   * @param {Object} mailOption 邮件内容
   * @returns {void}
   */
  async sendMail(mailOption: any) {
    // 邮件发送方的设置
    const transporter = nodemail.createTransport(smtpTransport(this.config.mail_opts));
    for (let i = 0; i < 5; i++) {
      try {
        await transporter.sendMail(mailOption);
        i = 5;
      } catch (error) {
        console.log(error);
        if (i === 4) {
          return { status: 400, code: 4020 }; //返回邮件发送错误code
        }
      }
    }
    const index = mailOption.to.indexOf('@');
    const start = (index - 1) / 2;
    const replaceStr = mailOption.to.substring(start, index - 1);
    const str = '*'.repeat(replaceStr.length);
    const mail = mailOption.to.replace(replaceStr, str);
    return { status: 200, code: 2010, data: mail }; //返回成功code
  }

  async sendVerifyCode(email: string, code: string) {
    const from = util.format('%s <%s>', this.config.name, this.config.mail_opts.auth.user);
    const to = email;
    const subject = `账号重置密码`;
    const html = `您正在重置SPAN账号的密码,验证码为: <p1>${code}</p1>`;

    const mailOption = { from, to, subject, html };
    return await this.sendMail(mailOption);
  }

  async genVerifyCode(userId: string): Promise<string> {
    const code = randomize('0', 6);
    const client = this.redis.getClient();
    await client.set(userId, code, 'EX', 60 * 5);
    return code;
  }

  async codeVerify(userId: string, code: string) {
    const client = this.redis.getClient();
    const storeCode = await client.get(userId);
    if (!storeCode) {
      throw new ApiException('code expired', ApiErrorCode.INPUT_ERROR, 406);
    }
    if (storeCode === code) {
      return true;
    } else {
      throw new ApiException('code invalid', ApiErrorCode.INPUT_ERROR, 406);
    }
  }
}
