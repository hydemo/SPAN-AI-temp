import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { CryptoUtil } from '@utils/crypto.util';
import * as md5 from 'md5';
import { LeanDocument, Model } from 'mongoose';
import { RedisService } from 'nest-redis';
import { ApiErrorCode } from 'src/common/enum/api-error-code.enum';
import { ApiException } from 'src/common/exception/api.exception';
import { ConfigService } from 'src/config/config.service';
import { EmailUtil } from 'src/utils/email.util';

import { CreateAdminDTO, NewPassDTO, ResetPassDTO } from './admin.dto';
import { Admin, IAdmin } from './admin.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<IAdmin>,
    @Inject(CryptoUtil) private readonly cryptoUtil: CryptoUtil,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(EmailUtil) private readonly emailUtil: EmailUtil,
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {}

  // 根据id查找
  async findById(id: string): Promise<LeanDocument<IAdmin>> {
    return await this.adminModel.findById(id).lean().exec();
  }

  async count(): Promise<LeanDocument<number>> {
    return await this.adminModel.countDocuments({ role: 0 }).lean().exec();
  }

  // 创建数据
  async create(createAdminDTO: CreateAdminDTO): Promise<void> {
    const existing: IAdmin = await this.adminModel.findOne({
      $or: [
        { email: createAdminDTO.email, isDelete: false },
        { username: createAdminDTO.username, isDelete: false },
      ],
    });
    let phoneExist: IAdmin | undefined;
    if (createAdminDTO.phone) {
      phoneExist = await this.adminModel.findOne({
        phone: createAdminDTO.phone,
        isDelete: false,
      });
    } else {
      delete createAdminDTO.phone;
    }
    if (existing || phoneExist) {
      throw new ApiException('Already Exist', ApiErrorCode.EMAIL_EXIST, 400);
    }
    // 新账号创建
    createAdminDTO.password = this.cryptoUtil.encryptPassword(createAdminDTO.password);
    createAdminDTO.registerTime = Date.now();
    await this.adminModel.create(createAdminDTO);
    return;
  }

  // 根据账号查找
  async findByUsername(username: string): Promise<LeanDocument<IAdmin>> {
    return await this.adminModel
      .findOne({
        $or: [{ username }, { phone: username }, { email: username }],
      })
      .lean()
      .exec();
  }

  // 登陆
  async login(username: string, password: string, ip: string): Promise<any> {
    const admin: any = await this.findByUsername(username);
    // 判断账号是否存在
    if (!admin) {
      throw new ApiException('User Not Found', ApiErrorCode.NO_EXIST, 404);
    }

    //判断账号是否被删除
    if (admin.isDelete) {
      throw new ApiException('User Not Found', ApiErrorCode.NO_EXIST, 404);
    }
    if (!this.cryptoUtil.checkPassword(password, admin.password)) {
      throw new ApiException('Login Failed', ApiErrorCode.NO_PERMISSION, 400);
    }
    const token = await this.jwtService.sign({ id: admin._id, type: 'admin' });
    const client = this.redis.getClient();
    await client.hset('Admin_Token', String(admin._id), token);
    await this.adminModel
      .findByIdAndUpdate(admin._id, {
        lastLoginTime: new Date(),
        lastLoginIp: ip,
      })
      .lean()
      .exec();
    delete admin.password;
    return { token, userinfo: admin };
  }

  // 发送邮箱验证码
  async sendEmailVerifyCode(username: string) {
    const admin: any = await this.findByUsername(username);
    // 判断账号是否存在
    if (!admin) {
      throw new ApiException('User Not Found', ApiErrorCode.NO_EXIST, 404);
    }
    //判断账号是否被删除
    if (admin.isDelete) {
      throw new ApiException('User Not Found', ApiErrorCode.NO_EXIST, 404);
    }
    const code = await this.emailUtil.genVerifyCode(admin._id);
    return await this.emailUtil.sendVerifyCode(admin.email, code);
  }

  // 发送修改密码邮件
  async codeVerify(username: string, code: string) {
    const admin: any = await this.findByUsername(username);
    // 判断账号是否存在
    if (!admin) {
      throw new ApiException('User Not Found', ApiErrorCode.NO_EXIST, 404);
    }
    //判断账号是否被删除
    if (admin.isDelete) {
      throw new ApiException('User Not Found', ApiErrorCode.NO_EXIST, 404);
    }
    const check = await this.emailUtil.codeVerify(admin._id, code);
    if (check) {
      const token = await this.jwtService.sign({
        id: admin._id,
        type: 'admin',
      });
      return token;
    }
  }

  // 重置密码
  async resetPassword(username: string, reset: ResetPassDTO) {
    const admin: any = await this.findByUsername(username);
    // 判断账号是否存在
    if (!admin) {
      throw new ApiException('User Not Found', ApiErrorCode.NO_EXIST, 404);
    }
    //判断账号是否被删除
    if (admin.isDelete) {
      throw new ApiException('User Not Found', ApiErrorCode.NO_EXIST, 404);
    }
    const password = await this.cryptoUtil.encryptPassword(md5(reset.password));
    const msg = await this.jwtService.verify(reset.token);
    if (msg.type === 'admin' && msg.id === String(admin._id)) {
      await this.adminModel.findByIdAndUpdate(admin._id, { password });
      return true;
    } else {
      throw new ApiException('Token invalid', ApiErrorCode.NO_EXIST, 400);
    }
  }

  // 重置密码
  async resetNewPassword(id: string, reset: NewPassDTO) {
    const admin: any = await this.findById(id);
    if (!this.cryptoUtil.checkPassword(reset.oldPass, admin.password)) {
      throw new ApiException('Login Failed', ApiErrorCode.NO_PERMISSION, 400);
    }
    const password = await this.cryptoUtil.encryptPassword(reset.newPass);
    await this.adminModel.findByIdAndUpdate(admin._id, { password });
    return true;
  }

  // 重置密码token校验
  async forgetTokenCheck(token: string, res: any) {
    try {
      await this.jwtService.verify(token);
    } catch (error) {
      return res.redirect(`${this.config.cms_url}/resetpasswordOverTime`);
    }
    return res.redirect(`${this.config.cms_url}/resetpassword?token=${token}`);
  }
}
