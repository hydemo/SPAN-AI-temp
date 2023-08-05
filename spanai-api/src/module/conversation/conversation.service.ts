import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { GPTService } from '../AIHandler/GPT.service';
import { ChatService } from '../chat/chat.service';

import { CreateConversationDTO, SendMessageDTO, UpdateConversationDTO } from './conversation.dto';
import { IConversation, Conversation } from './conversation.schema';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name) private readonly conversationModel: Model<IConversation>,
    @Inject(GPTService) private readonly gptService: GPTService,
    @Inject(ChatService) private readonly chatService: ChatService,
  ) {}

  // 获取员工全部信息
  async list(pagination: any) {
    const condition: any = {};
    const searchCondition = [];
    if (pagination.chat) {
      condition.chat = pagination.chat;
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
      .populate({ path: 'user', model: 'User' })
      .lean()
      .exec();
    const total = await this.conversationModel.countDocuments(condition).lean().exec();
    return { data, total };
  }

  async getMessageByChat(chatId: string) {
    return await this.conversationModel.find({ chat: chatId }).sort({ createdAt: -1 });
  }

  async sendGPTMessage(chatId: string, content: string) {
    const messages = await this.getMessageByChat(chatId);
    if (!messages.length) {
      await this.chatService.update(chatId, content);
    }
    const formatMessages = messages.map((item) => ({ content: item.content, role: item.role }));
    return await this.gptService.conversation(formatMessages);
  }

  async sendMessage(user: string, message: SendMessageDTO) {
    const newConversation: CreateConversationDTO = {
      user,
      chat: message.chatId,
      content: message.content,
      model: message.model,
      parent: message.parent ? message.parent : message.chatId,
      role: 'user',
    };
    const newUserConversation = await this.conversationModel.create(newConversation);
    const aiMessage = await this.sendGPTMessage(message.chatId, message.content);
    const newAIRespnose: CreateConversationDTO = {
      user,
      chat: message.chatId,
      content: aiMessage,
      model: message.model,
      parent: newUserConversation._id,
      role: 'assistant',
    };
    await this.conversationModel.create(newAIRespnose);
    return aiMessage;
  }

  async update(id: string, conversation: UpdateConversationDTO) {
    await this.conversationModel.findByIdAndUpdate(id, conversation);
    return true;
  }
}
