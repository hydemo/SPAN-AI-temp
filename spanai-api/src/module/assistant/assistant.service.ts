import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OpenAIAssistantRunnable } from 'langchain/experimental/openai_assistant';
import { OpenAIFiles } from 'langchain/experimental/openai_files';
import { Model } from 'mongoose';

import { GPTService } from '../AIHandler/GPT.service';
import { GPTFileService } from '../gptFile/gptFile.service';

import { CreateAssistantDTO } from './assistant.dto';
import { IAssistant, Assistant } from './assistant.schema';

@Injectable()
export class AssistantService {
  constructor(
    @InjectModel(Assistant.name) private readonly assistantModel: Model<IAssistant>,
    private readonly gptFileService: GPTFileService,
    private readonly gptService: GPTService,
  ) {}

  // 获取员工全部信息
  async list(pagination: any) {
    const condition: any = {};
    const searchCondition = [];
    if (pagination.name) {
      searchCondition.push({ name: new RegExp(pagination.name, 'i') });
    }
    const data = await this.assistantModel
      .find(condition)
      .sort({ createdAt: -1 })
      .limit(pagination.pageSize)
      .skip((pagination.current - 1) * pagination.pageSize)
      .populate({ path: 'files', model: 'GPTFile' })
      .lean()
      .exec();
    const total = await this.assistantModel.countDocuments(condition).lean().exec();
    return { data, total };
  }

  async createAgent(assistant: CreateAssistantDTO) {
    const gptFiles: any[] = await this.gptFileService.getGPTFiles(assistant.files);
    const apiKey = await this.gptService.getApiKey();
    console.log({
      model: assistant.model,
      // 'gpt-4-1106-preview',
      instructions: assistant.instructions,
      name: assistant.name,
      tools: assistant.tools.map((tool) => ({ type: tool })),
      asAgent: true,
      fileIds: gptFiles.map((item) => item.fileId),
      clientOptions: { apiKey },
    });
    const agent = await OpenAIAssistantRunnable.createAssistant({
      model: assistant.model,
      // 'gpt-4-1106-preview',
      instructions: assistant.instructions,
      name: assistant.name,
      tools: assistant.tools.map((tool) => ({ type: tool })),
      asAgent: true,
      fileIds: gptFiles.map((item) => item.fileId),
      clientOptions: { apiKey },
    });
    return agent.assistantId;
  }

  async create(assistant: CreateAssistantDTO) {
    const assistantId = await this.createAgent(assistant);
    await this.assistantModel.create({ ...assistant, assistantId: assistantId, expireTime: Date.now() + 60000000 });
  }

  async updateAssistant(assistant: IAssistant) {
    console.log(assistant.expireTime, Date.now() - assistant.expireTime, 'ss');
    if (Date.now() - assistant.expireTime > 0) {
      const assistantId = await this.createAgent(assistant);
      await this.assistantModel.findByIdAndUpdate(assistant._id, { assistantId, expireTime: Date.now() + 60000000 });
      return assistantId;
    }
    return assistant.assistantId;
  }
}
