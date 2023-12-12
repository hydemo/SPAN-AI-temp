import * as fs from 'fs';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OpenAIAssistantRunnable } from 'langchain/experimental/openai_assistant';
import { Model } from 'mongoose';
import OpenAI from 'openai';

import { GPTService } from '../AIHandler/GPT.service';
import { CreateAssistantDTO } from '../assistant/assistant.dto';
import { IAssistant } from '../assistant/assistant.schema';
import { AssistantService } from '../assistant/assistant.service';
import { CreateConversationDTO } from '../conversation/conversation.dto';
import { ConversationService } from '../conversation/conversation.service';
import { IGPTFile } from '../gptFile/gptFile.schema';
import { GPTFileService } from '../gptFile/gptFile.service';
import { IUser } from '../user/user.schema';

import { AssistantMessageDTO, CreateUserAssistantsByUserDTO, CreateUserAssistantsDTO } from './userAssistant.dto';
import { IUserAssistants, UserAssistants } from './userAssistant.schema';

@Injectable()
export class UserAssistantsService {
  constructor(
    @InjectModel(UserAssistants.name)
    private readonly userAssistantModel: Model<IUserAssistants>,
    private gptService: GPTService,
    private assistantService: AssistantService,
    private conversationService: ConversationService,
    private GPTFileService: GPTFileService,
  ) {}

  async sleep(timeout: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1);
      }, timeout);
    });
  }

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

  async createThread(apiKey: string, content: string) {
    const client = new OpenAI({ apiKey });
    const thread = await client.beta.threads.create({
      messages: [
        {
          role: 'user',
          content,
        },
      ],
    });
    return thread;
  }

  async createRun(apiKey: string, threadId: string, assistantId: string) {
    const client = new OpenAI({ apiKey });
    return await client.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });
  }

  async isComplete(apiKey: string, threadId: string, runId: string) {
    const client = new OpenAI({ apiKey });
    const run = await client.beta.threads.runs.retrieve(threadId, runId);
    return run.status === 'completed';
  }

  async getRunSteps(apiKey: string, threadId: string, runId: string) {
    const client = new OpenAI({ apiKey });
    const runSteps = await client.beta.threads.runs.steps.list(threadId, runId);
    return runSteps.data;
  }

  async getMessage(apiKey: string, threadId: string, messageId: string) {
    const client = new OpenAI({ apiKey });
    const message = await client.beta.threads.messages.retrieve(threadId, messageId);
    return message[0].content.text.value;
  }

  async formatStepDetail(apiKey: string, threadId: string, stepDetail: any) {
    if (stepDetail.type === 'tool_calls') {
      return {
        type: 'code',
        content: stepDetail.tool_calls.map((item) => item.code_interpreter.input),
      };
    }
    if (stepDetail.type === 'message_creation') {
      const content = await this.getMessage(apiKey, threadId, stepDetail.message_creation.message_id);
      return {
        type: 'message',
        content,
      };
    }
  }

  async formatResponse(apiKey: string, threadId: string, runId: string, res: any) {
    let timeout = 5000;
    let count = 0;
    const existStep = {};
    while (true && count < 20) {
      const steps = await this.getRunSteps(apiKey, threadId, runId);
      for (const step of steps) {
        if (!existStep[step.id] && step.status === 'completed') {
          const message = await this.formatStepDetail(apiKey, threadId, step.step_details);
          res.write(JSON.stringify(message));
        }
      }
      const isComplete = this.isComplete(apiKey, threadId, runId);
      if (isComplete) {
        break;
      }
      await this.sleep(timeout);
      timeout = 10000;
      count++;
    }
    res.end();
  }

  async conversation(user: IUser, assistantMessage: AssistantMessageDTO, res: any) {
    // const questionTime = Date.now();
    const userAssistant: any = await this.userAssistantModel
      .findById(assistantMessage.assistant)
      .populate({ path: 'assistant', model: 'Assistant' });
    const assistantId = await this.assistantService.updateAssistant(userAssistant.assistant);

    const apiKey = await this.gptService.getApiKey();
    const thread = await this.createThread(apiKey, assistantMessage.content);
    const run = await this.createRun(apiKey, thread.id, assistantId);
    this.formatResponse(apiKey, thread.id, run.id, res);

    // fs.writeFileSync('temp/a.txt', JSON.stringify(assistantResponse));
    // const content = assistantResponse[0]?.content[0]?.text?.value;
    // await this.saveResult(user, userAssistant.assistant, assistantMessage, content, questionTime);
    // await this.updateConversationCount(userAssistant);
    // return content;
  }

  async createUserAssistants(user: IUser, createUserAssistants: CreateUserAssistantsByUserDTO) {
    const gptFiles: IGPTFile[] = [];
    for (const file of createUserAssistants.files) {
      const gptFile = await this.GPTFileService.create(file, user._id);
      gptFiles.push(gptFile);
    }
    const newAssistant: CreateAssistantDTO = {
      model: createUserAssistants.model,
      // 'gpt-4-1106-preview',
      instructions: createUserAssistants.instructions,
      name: createUserAssistants.name,
      tools: createUserAssistants.tools,
      files: [],
    };
    const assistant = await this.assistantService.createAssistantWithFiles(newAssistant, gptFiles);
    return await this.userAssistantModel.create({ user: user._id, assistant: assistant._id });
  }
}
