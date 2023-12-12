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

  async create(gptFile: CreateGPTFileDTO, user?: string) {
    const path = `temp/gptFile/${gptFile.filename}`;
    const apiKey = await this.gptService.getApiKey();
    const openAIFiles = new OpenAIFiles({ clientOptions: { apiKey } });
    const file = await openAIFiles.createFile({
      file: fs.createReadStream(path),
      purpose: 'assistants',
    });
    fs.unlinkSync(path);
    const newGptFile: any = {
      name: gptFile.name,
      fileId: file.id,
    };
    if (user) {
      newGptFile.user = user;
    }
    return await this.gptFileModel.create(newGptFile);
  }

  async getGPTFiles(ids: string[]) {
    return await this.gptFileModel.find({ _id: { $in: ids } });
  }

  async retrieveFile(fileId: string) {
    const apiKey = await this.gptService.getApiKey();
    const openAIFiles = new OpenAIFiles({ clientOptions: { apiKey } });
    const result: any = await openAIFiles.retrieveFileContent({
      fileId: 'file-tEMdaI8vVI0noNkOiwbrBreG',
      options: { __binaryResponse: true },
    });
    const bufferView = new Uint8Array(await result.arrayBuffer());

    fs.writeFileSync('file-RVCrAxkMuRHW7LQ96AvM40mC', bufferView);

    // fs.writeFileSync('file-kqzPeg6MhD0HoCaDnaK3XSJN.png', result, 'binary');
    // 创建一个 Buffer 对象

    // 写入文件
    console.log(result, 'result');
  }
}
