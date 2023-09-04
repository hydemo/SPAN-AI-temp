import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import * as GptTokenCounter from 'openai-gpt-token-counter';
import { ApiErrorCode } from 'src/common/enum/api-error-code.enum';
import { ApiException } from 'src/common/exception/api.exception';

import { GPTService } from '../AIHandler/GPT.service';
import { ChatService } from '../chat/chat.service';
import { IUser } from '../user/user.schema';
import { UserService } from '../user/user.service';

import { CreateConversationDTO, SendMessageDTO, UpdateConversationDTO } from './conversation.dto';
import { IConversation, Conversation } from './conversation.schema';

const gptTokenCounter: any = GptTokenCounter;

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name) private readonly conversationModel: Model<IConversation>,
    @Inject(GPTService) private readonly gptService: GPTService,
    @Inject(ChatService) private readonly chatService: ChatService,
    @Inject(UserService) private readonly userService: UserService,
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
      .sort({ createdAt: -1 })
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
    return await this.conversationModel.find({ chat: chatId });
  }

  async getMessages(chatId: string, content: string) {
    const messages: any = await this.getMessageByChat(chatId);
    if (messages.length <= 1) {
      await this.chatService.update(chatId, content);
    }
    messages.push({ content, role: 'user' });
    return messages.map((item) => ({ content: item.content, role: item.role }));
  }

  async sendGPTMessage(messages: any[], model: any) {
    return await this.gptService.conversation(messages, model);
  }

  expiredCheck(user: IUser) {
    const now = moment().format('YYYY-MM-DD');
    if (user.expired && now > user.expired) {
      throw new ApiException('用户已过期，请联系管理员!', ApiErrorCode.NO_PERMISSION, 403);
    }
  }

  async limitCheck(messages: any[], user: IUser) {
    const userQuestions = await this.conversationModel.find({ user: user._id, role: 'user' });
    let chatTokens = 0;
    userQuestions.forEach((question) => {
      if (question.promptTokens) {
        chatTokens = chatTokens + question.promptTokens;
      }
    });
    if (user.questionCount && userQuestions.length > user.questionCount) {
      throw new ApiException('提问数已达限制，请联系管理员!', ApiErrorCode.NO_PERMISSION, 403);
    }
    const model: any = user.model || 'gpt-3.5-turbo';
    const tokenCount = gptTokenCounter.chat(messages, model);
    if (tokenCount > user.singleQuestionToken) {
      throw new ApiException('单个问题超出token数限制，请简化提问方式!', ApiErrorCode.NO_PERMISSION, 403);
    }
    if (user.singleChatToken && chatTokens + tokenCount > user.singleChatToken) {
      throw new ApiException('单个聊天窗口超出token数限制，请联系管理员!', ApiErrorCode.NO_PERMISSION, 403);
    }
  }

  async sendMessage(user: IUser, message: SendMessageDTO) {
    this.expiredCheck(user);
    const formatMessages = await this.getMessages(message.chatId, message.content);
    await this.limitCheck(formatMessages, user);
    const aiMessage = await this.sendGPTMessage(formatMessages, user.model);
    const responseContent = aiMessage.choices[0].message.content;
    const promptTokens = aiMessage.usage.prompt_tokens;
    const totalTokens = aiMessage.usage.total_tokens;
    const newConversation: CreateConversationDTO = {
      user: user._id,
      chat: message.chatId,
      content: message.content,
      model: aiMessage.model,
      parent: message.parent ? message.parent : message.chatId,
      role: 'user',
      promptTokens,
      totalTokens,
    };
    const newUserConversation = await this.conversationModel.create(newConversation);
    const newAIRespnose: CreateConversationDTO = {
      user: user._id,
      chat: message.chatId,
      content: responseContent,
      model: aiMessage.model,
      parent: newUserConversation._id,
      role: 'assistant',
      promptTokens,
      totalTokens,
    };
    await this.conversationModel.create(newAIRespnose);
    await this.userService.updateToken(user, promptTokens, totalTokens);
    return responseContent;
  }

  async update(id: string, conversation: UpdateConversationDTO) {
    await this.conversationModel.findByIdAndUpdate(id, conversation);
    return true;
  }
}
