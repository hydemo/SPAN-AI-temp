import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateChatDTO } from './chat.dto';
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
    if (pagination.type !== 'conversation') {
      condition.type = pagination.type;
    }
    const data = await this.chatModel
      .find(condition)
      .sort({ createdAt: -1 })
      .limit(pagination.pageSize)
      .skip((pagination.current - 1) * pagination.pageSize)
      .select({ password: 0 })
      .populate({ path: 'user', model: 'User' })
      .lean()
      .exec();
    const total = await this.chatModel.countDocuments(condition).lean().exec();
    return { data, total };
  }

  async create(user: string, chat: CreateChatDTO) {
    const newChat = await this.chatModel.create({ user, name: chat.name, type: chat.type });
    return newChat;
  }

  async getChatsByUser(user: string) {
    const chats = await this.chatModel.find({ user });
    return chats;
  }

  async getChatsById(chatId: string) {
    return await this.chatModel.findById(chatId);
  }

  async update(id: string, name: string) {
    await this.chatModel.findByIdAndUpdate(id, { name });
    return true;
  }

  async updateConversionCount(id: string, conversionCount: number) {
    await this.chatModel.findByIdAndUpdate(id, { conversionCount });
    return true;
  }
}
