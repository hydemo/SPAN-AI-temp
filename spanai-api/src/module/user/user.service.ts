import * as fs from 'fs';
import { join } from 'path';

import { ApiErrorCode } from '@common/enum/api-error-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { CryptoUtil } from '@utils/crypto.util';
import * as md5 from 'md5';
import * as moment from 'moment';
import { LeanDocument, Model } from 'mongoose';
import { RedisService } from 'nest-redis';
import { ApiException } from 'src/common/exception/api.exception';
import * as XLSX from 'xlsx';

import { CreateUserDTO, Password, UpdateUserDTO, ResetMyPassDTO } from './user.dto';
import { IUser, User } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
    @Inject(CryptoUtil) private readonly cryptoUtil: CryptoUtil,
    @Inject(JwtService) private readonly jwtService: JwtService,
    private redis: RedisService,
  ) {}

  // 根据账号查找
  async findByUsername(username: string): Promise<LeanDocument<IUser>> {
    return await this.userModel
      .findOne({
        isDelete: { $ne: true },
        $or: [{ username }, { email: username }, { phone: username }],
      })
      // .select({ username: 1, avatar: 1, isDelete: 1, password: 1, email: 1, phone: 1 })
      .lean()
      .exec();
  }

  // 统计数量
  async countByCondition(condition: any): Promise<number> {
    return await this.userModel.countDocuments(condition);
  }

  // 注销
  async signOut(userId: string): Promise<void> {
    const client = this.redis.getClient();
    await client.hdel('User_Token', String(userId));
  }

  // 注销
  async delete(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { isDelete: true });
  }

  // 根据id查找
  async findById(id: string): Promise<LeanDocument<IUser>> {
    return await this.userModel.findById(id).lean().exec();
  }

  // 登陆
  async login(username: string, password: string, ip: string) {
    const user: any = await this.findByUsername(username);
    // 判断账号是否存在
    if (!user) {
      throw new ApiException('User Not Found', ApiErrorCode.NO_EXIST, 404);
    }
    //判断账号是否被删除
    if (user.isDelete) {
      throw new ApiException('User Not Found', ApiErrorCode.NO_EXIST, 404);
    }
    if (!this.cryptoUtil.checkPassword(password, user.password)) {
      throw new ApiException('Login Failed', ApiErrorCode.NO_EXIST, 404);
    }
    const now = moment().format('YYYY-MM-DD');
    if (user.expired && now > user.expired) {
      throw new ApiException('用户已过期，请联系管理员!', ApiErrorCode.NO_PERMISSION, 403);
    }
    const token = this.jwtService.sign({ id: user._id, type: 'user' }, { expiresIn: '7d' });
    await this.userModel
      .findByIdAndUpdate(user._id, {
        lastLoginTime: new Date(),
        lastLoginIp: ip,
      })
      .lean()
      .exec();
    delete user.password;
    return { token, userinfo: user };
  }

  async resetMyPassword(user: IUser, reset: ResetMyPassDTO) {
    const result = this.cryptoUtil.checkPassword(reset.oldPass, user.password);
    if (!result) {
      throw new ApiException('密码错误', ApiErrorCode.NO_PERMISSION, 403);
    }
    const password = this.cryptoUtil.encryptPassword(reset.newPass);
    await this.userModel.findByIdAndUpdate(user._id, { password });
    return true;
  }

  // 获取员工全部信息
  async list(pagination: any) {
    const sorter = pagination.sorter ? JSON.parse(pagination.sorter) : {};
    const condition: any = {
      isDelete: { $ne: true },
    };
    const searchCondition = [];
    if (pagination.email) {
      searchCondition.push({ email: new RegExp(pagination.email, 'i') });
    }
    if (pagination.username) {
      searchCondition.push({ username: new RegExp(pagination.username, 'i') });
    }
    if (pagination.phone) {
      searchCondition.push({ phone: new RegExp(pagination.phone, 'i') });
    }
    if (searchCondition.length) {
      condition.$or = searchCondition;
    }
    const sorterCondition = {};
    Object.keys(sorter).forEach((key) => {
      sorterCondition[key] = sorter[key] === 'ascend' ? 0 : -1;
    });

    const data = await this.userModel
      .find(condition)
      .sort(sorterCondition)
      .limit(pagination.pageSize)
      .skip((pagination.current - 1) * pagination.pageSize)
      .select({ password: 0 })
      .lean()
      .exec();
    const total = await this.userModel.countDocuments(condition).lean().exec();
    return { data, total };
  }

  async update(id: string, user: UpdateUserDTO) {
    const userExist = await this.userModel.findById(id);
    if (!userExist) {
      throw new ApiException('No Found', ApiErrorCode.NO_EXIST, 404);
    }
    if (user.email && user.email !== userExist.email) {
      const emailExist = await this.userModel
        .find({ email: user.email, _id: { $ne: id }, isDelete: { $ne: true } })
        .lean()
        .exec();
      if (emailExist.length) {
        throw new ApiException('Email Exist', ApiErrorCode.EMAIL_EXIST, 400);
      }
    }
    if (user.username && user.username !== userExist.username) {
      const usernameExist = await this.userModel
        .find({ username: user.username, _id: { $ne: id }, isDelete: { $ne: true } })
        .lean()
        .exec();
      if (usernameExist.length) {
        throw new ApiException('username Exist', ApiErrorCode.EMAIL_EXIST, 400);
      }
    }
    const updateUser = {
      expired: '',
      singleQuestionToken: 0,
      singleChatToken: 0,
      questionCount: 0,
      ...user,
    };
    await this.userModel.findByIdAndUpdate(id, updateUser);
    return true;
  }

  async create(user: CreateUserDTO) {
    const emailExist = await this.userModel
      .find({ email: user.email, isDelete: { $ne: true } })
      .lean()
      .exec();
    if (emailExist.length) {
      throw new ApiException('Email Exist', ApiErrorCode.EMAIL_EXIST, 400);
    }
    const usernameExist = await this.userModel
      .find({ username: user.username, isDelete: { $ne: true } })
      .lean()
      .exec();
    if (usernameExist.length) {
      throw new ApiException('username Exist', ApiErrorCode.EMAIL_EXIST, 400);
    }
    const phoneExist = await this.userModel
      .find({ phone: user.username, isDelete: { $ne: true } })
      .lean()
      .exec();
    if (phoneExist.length) {
      throw new ApiException('phone Exist', ApiErrorCode.PHONE_EXIST, 400);
    }
    const password = this.cryptoUtil.encryptPassword(user.password);
    await this.userModel.create({ ...user, password });
    return true;
  }

  async updateToken(user: IUser, promptTokens: number, totalTokens: number) {
    const usedPromptTokens = user.usedPromptTokens || 0;
    const usedTotalTokens = user.usedTotalTokens || 0;
    await this.userModel.findByIdAndUpdate(user._id, {
      usedPromptTokens: usedPromptTokens + promptTokens,
      usedTotalTokens: usedTotalTokens + totalTokens,
    });
  }

  async uploadTemplate(path: string, filename: string) {
    const workbook = XLSX.readFile(`${path}/${filename}`);
    const sheetNames = workbook.SheetNames;
    const worksheet = workbook.Sheets[sheetNames[0]];
    const users = XLSX.utils.sheet_to_json(worksheet);
    const newUsers: CreateUserDTO[] = users
      .map((item) => {
        const password = this.cryptoUtil.encryptPassword(md5(item['初始密码'].toString() || '1234'));
        const model = item['模型'] && item['模型'] === 'gpt-4' ? 'gpt-4' : 'gpt-3.5-turbo';
        const newUser = {
          username: item['用户名'],
          email: item['电子邮箱'],
          phone: item['手机号'],
          password,
          model,
          expired: item['过期时间'] || '',
          singleQuestionToken: item['单个问题最大token'] ? parseInt(item['单个问题最大token']) : 0,
          singleChatToken: item['单个聊天最大token数'] ? parseInt(item['单个聊天最大token数']) : 0,
          questionCount: item['问题数'] ? parseInt(item['问题数']) : 0,
        };
        if (item['手机号']) {
          newUser.phone = item['手机号'];
        }
        return newUser;
      })
      .filter((v) => v);
    const usernames = newUsers.map((item) => item.username);
    const emails = newUsers.map((item) => item.email);
    const phones = newUsers.map((item) => item.phone).filter((v) => v);
    const exist = await this.userModel.find({
      $or: [
        { username: { $in: usernames }, isDelete: { $ne: true } },
        { email: { $in: emails }, isDelete: { $ne: true } },
        { phone: { $in: phones }, isDelete: { $ne: true } },
      ],
    });
    if (exist.length) {
      throw new ApiException('用户已存在', ApiErrorCode.EMAIL_EXIST, 400);
    }
    await this.userModel.insertMany(newUsers);
  }

  // 重置密码
  async resetPassword(userId: string, reset: Password) {
    const password = await this.cryptoUtil.encryptPassword(reset.password);
    await this.userModel.findByIdAndUpdate(userId, { password });
    return { status: 200, msg: 'success' };
  }

  // 获取上传报告列表
  async reports(userId: string) {
    const userPath = join(`temp/upload/${userId}`);
    if (!fs.existsSync(userPath)) {
      return [];
    }
    const fileList: string[] = fs.readdirSync(userPath);
    return fileList.filter((item) => item[0] !== '.').map((item) => ({ name: item }));
  }
}
