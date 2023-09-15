import * as fs from 'fs';

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as JSON2CSV from 'json2csv';
import * as moment from 'moment';
import { Model } from 'mongoose';
import * as GptTokenCounter from 'openai-gpt-token-counter';
import { ApiErrorCode } from 'src/common/enum/api-error-code.enum';
import { ApiException } from 'src/common/exception/api.exception';
import * as XLSX from 'xlsx';

import { GPTService } from '../AIHandler/GPT.service';
import { ChatService } from '../chat/chat.service';
import { IUser } from '../user/user.schema';
import { UserService } from '../user/user.service';

import { CreateConversationDTO, SendMessageDTO, UpdateConversationDTO } from './conversation.dto';
import { IConversation, Conversation } from './conversation.schema';

const gptTokenCounter: any = GptTokenCounter;
@Injectable()
export class ConversationService {
  private PATH = 'temp/download';
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
    if (pagination.content) {
      condition.content = new RegExp(pagination.content || '', 'i');
    }
    if (pagination.user) {
      condition.user = pagination.user;
    }
    if (pagination.role) {
      condition.role = pagination.role;
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
    const questionTime = Date.now();
    this.expiredCheck(user);
    const formatMessages = await this.getMessages(message.chatId, message.content);
    await this.limitCheck(formatMessages, user);
    const aiMessage = await this.sendGPTMessage(formatMessages, user.model);
    const responseContent = aiMessage.choices[0].message.content;
    const promptTokens = aiMessage.usage.prompt_tokens;
    const totalTokens = aiMessage.usage.total_tokens;
    const answerTime = (Date.now() - questionTime) / 1000;
    const newConversation: CreateConversationDTO = {
      user: user._id,
      chat: message.chatId,
      content: message.content,
      model: aiMessage.model,
      parent: message.parent ? message.parent : message.chatId,
      role: 'user',
      promptTokens,
      totalTokens,
      questionTime,
      answerTime,
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
      questionTime,
      answerTime,
    };
    await this.conversationModel.create(newAIRespnose);
    await this.userService.updateToken(user, promptTokens, totalTokens);
    return responseContent;
  }

  async update(id: string, conversation: UpdateConversationDTO) {
    await this.conversationModel.findByIdAndUpdate(id, conversation);
    return true;
  }

  async download(type: string) {
    const result: any = await this.conversationModel.find().populate({ model: 'User', path: 'user' });
    const answerMap = {};
    result.forEach((item) => {
      if (item.role === 'assistant') {
        answerMap[item.parent] = item;
      }
    });
    const downLoadResult = result
      .filter((item) => item.role === 'user')
      .map((item) => {
        const answer = answerMap[item._id] || {};
        return {
          用户Id: item.user._id,
          用户名: item.user.username,
          chatId: item.chat,
          prompt内容: item.content,
          ai回复内容: answer.content,
          'prompt token': item.promptTokens,
          总token: item.totalTokens,
          prompt时间: item.questionTime ? moment(item.questionTime).format('YYYY-MM-DD HH:mm:ss') : '',
          回复时间: item.answerTime,
        };
      });
    const filename = `聊天记录-${moment().format('YYYY-MM-DD')}`;
    switch (type) {
      case 'xlsx':
        const sheet = XLSX.utils.json_to_sheet(downLoadResult);
        const sheetName = '未完成名单';
        const SheetNames = [];
        const Sheets = {};

        SheetNames.push(sheetName);
        Sheets[sheetName] = sheet;
        const workbook = {
          SheetNames,
          Sheets,
        };
        XLSX.writeFile(workbook, `${this.PATH}/${filename}.xlsx`);
        break;
      case 'json':
        fs.writeFileSync(`${this.PATH}/${filename}.json`, JSON.stringify(downLoadResult, null, '\t'));
        break;
      case 'csv':
        const parser = new JSON2CSV.Parser();
        console.log(parser, 'ss');
        const csvResult = parser.parse(downLoadResult);
        fs.writeFileSync(`${this.PATH}/${filename}.csv`, csvResult);
      default:
        break;
    }

    return `${filename}.${type}`;
  }
}
