import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserAssistantsDTO } from './userAssistant.dto';
import { IUserAssistants, UserAssistants } from './userAssistant.schema';

@Injectable()
export class UserAssistantsService {
  constructor(@InjectModel(UserAssistants.name) private readonly userAssistantModel: Model<IUserAssistants>) {}

  // 获取员工全部信息
  async list(pagination: any) {
    const condition: any = {};
    if (pagination.user) {
      condition.user = pagination.user;
    }
    if (pagination.assistant) {
      condition.assistant = pagination.assistant;
    }
    const data = await this.userAssistantModel
      .find(condition)
      .sort({ createdAt: -1 })
      .limit(pagination.pageSize)
      .skip((pagination.current - 1) * pagination.pageSize)
      .populate({ path: 'user', model: 'User' })
      .populate({ path: 'assistant', model: 'Assistant' })
      .lean()
      .exec();
    const total = await this.userAssistantModel.countDocuments(condition).lean().exec();
    return { data, total };
  }

  async create(userAssistants: CreateUserAssistantsDTO) {
    await this.userAssistantModel.create(userAssistants);
  }
}
