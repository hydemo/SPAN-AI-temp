import * as fs from 'fs';

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GPTTokens } from 'gpt-tokens';
import * as JSON2CSV from 'json2csv';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { ApiErrorCode } from 'src/common/enum/api-error-code.enum';
import { ApiException } from 'src/common/exception/api.exception';
import * as XLSX from 'xlsx';

import { GPTService } from '../AIHandler/GPT.service';
import { ChatService } from '../chat/chat.service';
import { ISummary } from '../summary/summary.schema';
import { SummaryService } from '../summary/summary.service';
import { IUser } from '../user/user.schema';
import { UserService } from '../user/user.service';

import { CreateConversationDTO, SendMessageDTO, UpdateConversationDTO } from './conversation.dto';
import { IConversation, Conversation } from './conversation.schema';

@Injectable()
export class ConversationService {
  private PATH = 'temp/download';
  constructor(
    @InjectModel(Conversation.name) private readonly conversationModel: Model<IConversation>,
    @Inject(GPTService) private readonly gptService: GPTService,
    @Inject(ChatService) private readonly chatService: ChatService,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(SummaryService) private readonly summaryService: SummaryService,
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

  expiredCheck(user: IUser) {
    const now = moment().format('YYYY-MM-DD');
    if (user.expired && now > user.expired) {
      throw new ApiException('用户已过期，请联系管理员!', ApiErrorCode.NO_PERMISSION, 403);
    }
  }

  async limitCheck(messages: any[], user: IUser, chatId: string) {
    const userQuestions = await this.conversationModel.find({ user: user._id, role: 'user', chat: chatId });
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
    const usageInfo = new GPTTokens({ model, messages });
    const tokenCount = usageInfo.promptUsedTokens;
    if (tokenCount > user.singleQuestionToken) {
      throw new ApiException('单个问题超出token数限制，请简化提问方式!', ApiErrorCode.NO_PERMISSION, 403);
    }
    if (user.singleChatToken && chatTokens + tokenCount > user.singleChatToken) {
      throw new ApiException('单个聊天窗口超出token数限制，请联系管理员!', ApiErrorCode.NO_PERMISSION, 403);
    }
    return tokenCount;
  }

  async saveResult(user: IUser, newConversation: CreateConversationDTO, responseContent: string, messages: any) {
    const newUserConversation = await this.conversationModel.create(newConversation);
    const newAIRespnose: CreateConversationDTO = {
      ...newConversation,
      content: responseContent,
      parent: newUserConversation._id,
      role: 'assistant',
    };
    await this.conversationModel.create(newAIRespnose);
    await this.userService.updateToken(user, 1, 2);
    await this.chatService.updateConversionCount(newConversation.chat, messages.length + 1);
    return responseContent;
  }

  async sendMessage(user: IUser, message: SendMessageDTO) {
    const questionTime = Date.now();
    this.expiredCheck(user);
    const formatMessages = await this.getMessages(message.chatId, message.content);
    const promptTokens = await this.limitCheck(formatMessages, user, message.chatId);
    const messagesWithSummary = await this.summaryService.getMessageWithSummary(
      message.chatId,
      formatMessages,
      user.model || 'gpt-3.5-turbo',
    );
    const response: any = await this.gptService.conversation(messagesWithSummary.messages, user.model, true);
    let responseText = '';
    const newConversation: CreateConversationDTO = {
      user: user._id,
      chat: message.chatId,
      content: message.content,
      model: user.model,
      parent: message.parent ? message.parent : message.chatId,
      role: 'user',
      promptTokens,
      totalTokens: 0,
      questionTime,
      answerTime: 0,
    };
    response.data.on('data', (chunk: any) => {
      try {
        const lines = chunk
          .toString()
          .split('\n')
          .filter((line) => line.trim() !== '');
        for (const line of lines) {
          const msg = line.replace(/^data: /, '');
          if (msg == '[DONE]') {
            const answerTime = (Date.now() - questionTime) / 1000;
            newConversation.answerTime = answerTime;
            const model: any = user.model;
            const usageInfo = new GPTTokens({
              model,
              messages: [{ role: 'assistant', content: responseText }],
            });
            const answerTokens = usageInfo.completionUsedTokens;
            newConversation.totalTokens = promptTokens + answerTokens;
            this.saveResult(user, newConversation, responseText, formatMessages);
            this.summaryService.addSummary(messagesWithSummary.summary, formatMessages, model, responseText);
          } else {
            const parsed = JSON.parse(msg);
            if (parsed.choices[0].delta.content) {
              //解析出来的内容
              let content = parsed.choices[0].delta.content;
              if (content.startsWith(':')) {
                //转义
                content = '\\\\' + content;
              }
              responseText += content;
            }
          }
        }
      } catch (error) {
        throw new ApiException('服务器异常' + error, ApiErrorCode.INTERNAL_ERROR, 500);
      }
    });
    return response;
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
        const csvResult = parser.parse(downLoadResult);
        fs.writeFileSync(`${this.PATH}/${filename}.csv`, csvResult);
      default:
        break;
    }

    return `${filename}.${type}`;
  }
}
