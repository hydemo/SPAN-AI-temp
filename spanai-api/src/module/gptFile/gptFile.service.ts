import * as fs from 'fs';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OpenAIFiles } from 'langchain/experimental/openai_files';
import { Model } from 'mongoose';

import { GPTService } from '../AIHandler/GPT.service';

import { CreateGPTFileDTO } from './gptFile.dto';
import { IGPTFile, GPTFile } from './gptFile.schema';

@Injectable()
export class GPTFileService {
  constructor(
    @InjectModel(GPTFile.name) private readonly gptFileModel: Model<IGPTFile>,
    private readonly gptService: GPTService,
  ) {}

  // 获取员工全部信息
  async list(pagination: any) {
    const condition: any = {};
    const searchCondition = [];
    if (pagination.name) {
      searchCondition.push({ name: new RegExp(pagination.name, 'i') });
    }
    const data = await this.gptFileModel
      .find(condition)
      .sort({ createdAt: -1 })
      .limit(pagination.pageSize)
      .skip((pagination.current - 1) * pagination.pageSize)
      .lean()
      .exec();
    const total = await this.gptFileModel.countDocuments(condition).lean().exec();
    return { data, total };
  }

  async create(gptFile: CreateGPTFileDTO) {
    const path = `temp/gptFile/${gptFile.filename}`;
    const apiKey = await this.gptService.getApiKey();
    const openAIFiles = new OpenAIFiles({ clientOptions: { apiKey } });
    const file = await openAIFiles.createFile({
      file: fs.createReadStream(path),
      purpose: 'assistants',
    });
    fs.unlinkSync(path);
    await this.gptFileModel.create({ name: gptFile.name, fileId: file.id });
  }

  async getGPTFiles(ids: string[]) {
    return await this.gptFileModel.find({ _id: { $in: ids } });
  }
}
