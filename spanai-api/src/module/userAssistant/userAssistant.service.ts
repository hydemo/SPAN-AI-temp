import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OpenAIAssistantRunnable } from 'langchain/experimental/openai_assistant';
import { Model } from 'mongoose';

import { GPTService } from '../AIHandler/GPT.service';
import { IAssistant } from '../assistant/assistant.schema';
import { AssistantService } from '../assistant/assistant.service';
import { CreateConversationDTO } from '../conversation/conversation.dto';
import { ConversationService } from '../conversation/conversation.service';
import { IUser } from '../user/user.schema';

import { AssistantMessageDTO, CreateUserAssistantsDTO } from './userAssistant.dto';
import { IUserAssistants, UserAssistants } from './userAssistant.schema';

@Injectable()
export class UserAssistantsService {
  constructor(
    @InjectModel(UserAssistants.name) private readonly userAssistantModel: Model<IUserAssistants>,
    private gptService: GPTService,
    private assistantService: AssistantService,
    private conversationService: ConversationService,
  ) {}

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

  async listByUser(user: string) {
    const assistants: any = await this.userAssistantModel
      .find({ user })
      .sort({ createdAt: -1 })
      .populate({ path: 'assistant', model: 'Assistant' })
      .lean()
      .exec();
    return assistants.map((item) => ({
      type: 'assistant',
      name: item.assistant.name,
      createdAt: item.createdAt,
      _id: item._id,
      user: item.user,
      conversionCount: item.conversationCount ? item.conversationCount : 0,
    }));
  }

  async saveResult(
    user: IUser,
    assistant: IAssistant,
    assistantMessage: AssistantMessageDTO,
    content: string,
    questionTime: number,
  ) {
    const answerTime = (Date.now() - questionTime) / 1000;
    const newConversation: CreateConversationDTO = {
      user: user._id,
      assistant: assistantMessage.assistant,
      content: assistantMessage.content,
      model: assistant.model,
      parent: assistantMessage.parent ? assistantMessage.parent : assistantMessage.assistant,
      role: 'user',
      promptTokens: 0,
      totalTokens: 0,
      questionTime,
      type: 'assistant',
      answerTime,
    };
    const newUserConversation = await this.conversationService.createConversation(newConversation);
    const newAssistantRespnose: CreateConversationDTO = {
      ...newConversation,
      content: content,
      parent: newUserConversation._id,
      role: 'assistant',
    };
    await this.conversationService.createConversation(newAssistantRespnose);
  }

  async updateConversationCount(userAssistant: IUserAssistants) {
    const conversationCount = userAssistant.conversationCount ? userAssistant.conversationCount + 2 : 2;
    console.log(conversationCount, 'conversationCount');
    await this.userAssistantModel.findByIdAndUpdate(userAssistant._id, { conversationCount });
  }

  async conversation(user: IUser, assistantMessage: AssistantMessageDTO) {
    const questionTime = Date.now();
    const userAssistant: any = await this.userAssistantModel
      .findById(assistantMessage.assistant)
      .populate({ path: 'assistant', model: 'Assistant' });
    const apiKey = await this.gptService.getApiKey();
    const assistantId = await this.assistantService.updateAssistant(userAssistant.assistant);
    const agent = new OpenAIAssistantRunnable({
      assistantId,
      clientOptions: { apiKey },
    });
    const assistantResponse = await agent.invoke({
      content: assistantMessage.content,
    });
    const content = assistantResponse[0]?.content[0]?.text?.value;
    await this.saveResult(user, userAssistant.assistant, assistantMessage, content, questionTime);
    await this.updateConversationCount(userAssistant);
    return content;
  }
}
