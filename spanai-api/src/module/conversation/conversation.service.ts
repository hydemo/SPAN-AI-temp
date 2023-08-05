import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateConversationDTO, UpdateConversationDTO } from './conversation.dto';
import { IConversation, Conversation } from './conversation.schema';

@Injectable()
export class ConversationService {
  constructor(@InjectModel(Conversation.name) private readonly conversationModel: Model<IConversation>) {}

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
    const data = await this.conversationModel
      .find(condition)
      .sort({ layerId: 1 })
      .limit(pagination.pageSize)
      .skip((pagination.current - 1) * pagination.pageSize)
      .select({ password: 0 })
      .lean()
      .exec();
    const total = await this.conversationModel.countDocuments(condition).lean().exec();
    return { data, total };
  }

  async create(conversation: CreateConversationDTO) {
    await this.conversationModel.create(conversation);
    return true;
  }

  async update(id: string, conversation: UpdateConversationDTO) {
    await this.conversationModel.findByIdAndUpdate(id, conversation);
    return true;
  }
}
