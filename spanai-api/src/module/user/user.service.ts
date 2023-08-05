import { ApiErrorCode } from '@common/enum/api-error-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { CryptoUtil } from '@utils/crypto.util';
import { LeanDocument, Model } from 'mongoose';
import { RedisService } from 'nest-redis';
import { ApiException } from 'src/common/exception/api.exception';

import { CreateUserDTO, UpdateUserDTO } from './user.dto';
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
        isDelete: false,
        $or: [{ username }, { email: username }],
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

  // 获取员工全部信息
  async list(pagination: any) {
    const condition: any = {
      isDelete: false,
    };
    const searchCondition = [];
    if (pagination.email) {
      searchCondition.push({ email: new RegExp(pagination.email, 'i') });
    }
    if (pagination.username) {
      searchCondition.push({ username: new RegExp(pagination.username, 'i') });
    }
    if (searchCondition.length) {
      condition.$or = searchCondition;
    }
    const data = await this.userModel
      .find(condition)
      .sort({ layerId: 1 })
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
        .find({ email: user.email, _id: { $ne: id }, isDelete: false })
        .lean()
        .exec();
      if (emailExist.length) {
        throw new ApiException('Email Exist', ApiErrorCode.EMAIL_EXIST, 400);
      }
    }
    if (user.username && user.username !== userExist.username) {
      const usernameExist = await this.userModel
        .find({ username: user.username, _id: { $ne: id }, isDelete: false })
        .lean()
        .exec();
      if (usernameExist.length) {
        throw new ApiException('username Exist', ApiErrorCode.EMAIL_EXIST, 400);
      }
    }
    await this.userModel.findByIdAndUpdate(id, user);
    return true;
  }

  async create(user: CreateUserDTO) {
    const emailExist = await this.userModel.find({ email: user.email, isDelete: false }).lean().exec();
    if (emailExist.length) {
      throw new ApiException('Email Exist', ApiErrorCode.EMAIL_EXIST, 400);
    }
    const usernameExist = await this.userModel.find({ username: user.username, isDelete: false }).lean().exec();
    if (usernameExist.length) {
      throw new ApiException('username Exist', ApiErrorCode.EMAIL_EXIST, 400);
    }
    const password = this.cryptoUtil.encryptPassword(user.password);
    await this.userModel.create({ ...user, password });
    return true;
  }
}
