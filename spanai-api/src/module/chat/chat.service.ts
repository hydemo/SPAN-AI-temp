import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateChatDTO, UpdateChatDTO } from './chat.dto';
import { IChat, Chat } from './chat.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private readonly chatModel: Model<IChat>) {}

  // 获取员工全部信息
  async list(pagination: any) {
    const condition: any = {};
    const searchCondition = [];
    if (pagination.name) {
      searchCondition.push({ name: new RegExp(pagination.name, 'i') });
    }
    if (pagination.user) {
      condition.user = pagination.user;
    }
    if (searchCondition.length) {
      condition.$or = searchCondition;
    }
    const data = await this.chatModel
      .find(condition)
      .sort({ layerId: 1 })
      .limit(pagination.pageSize)
      .skip((pagination.current - 1) * pagination.pageSize)
      .select({ password: 0 })
      .lean()
      .exec();
    const total = await this.chatModel.countDocuments(condition).lean().exec();
    return { data, total };
  }

  async create(chat: CreateChatDTO) {
    await this.chatModel.create(chat);
    return true;
  }

  async update(id: string, chat: UpdateChatDTO) {
    await this.chatModel.findByIdAndUpdate(id, chat);
    return true;
  }
}