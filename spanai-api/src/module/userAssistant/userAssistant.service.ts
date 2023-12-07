import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OpenAIAssistantRunnable } from 'langchain/experimental/openai_assistant';
import { Model } from 'mongoose';

import { GPTService } from '../AIHandler/GPT.service';
import { AssistantService } from '../assistant/assistant.service';

import { AssistantMessageDTO, CreateUserAssistantsDTO } from './userAssistant.dto';
import { IUserAssistants, UserAssistants } from './userAssistant.schema';

@Injectable()
export class UserAssistantsService {
  constructor(
    @InjectModel(UserAssistants.name) private readonly userAssistantModel: Model<IUserAssistants>,
    private gptService: GPTService,
    private assistantService: AssistantService,
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
    }));
  }

  async conversation(assistantMessage: AssistantMessageDTO) {
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
    console.log(assistantResponse[0].content, 'ss');
    return assistantResponse[0]?.content[0]?.text?.value;
  }
}
