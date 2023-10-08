import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GPTTokens } from 'gpt-tokens';
import { Model } from 'mongoose';

import { GPTService } from '../AIHandler/GPT.service';

import { ISummary, Summary } from './summary.schema';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

@Injectable()
export class SummaryService {
  constructor(
    @InjectModel(Summary.name) private readonly summaryModel: Model<ISummary>,
    @Inject(GPTService) private readonly gptService: GPTService,
  ) {}

  async getMessageWithSummary(chatId: string, messages: Message[], model: any) {
    const summary = await this.summaryModel.findOne({ chat: chatId });
    if (!summary) {
      // return { messages, summary: null };
      const finalMessages = messages.length > 7 ? messages.slice(messages.length - 7) : messages;
      return { messages: finalMessages, summary: null };
    }
    const totalMessageCount = messages.length;

    const longTermMemoryStartIndex = summary.index;

    // short term memory
    const shortTermMemoryStartIndex = Math.max(0, totalMessageCount - 4);
    // lets concat send messages, including 4 parts:
    // 0. system prompt: to get close to OpenAI Web ChatGPT
    // 1. long term memory: summarized memory messages
    // 2. pre-defined in-context prompts
    // 3. short term memory: latest n messages
    // 4. newest input message
    const contextStartIndex = Math.min(longTermMemoryStartIndex, shortTermMemoryStartIndex);
    // and if user has cleared history messages, we should exclude the memory too.
    // get recent messages as much as possible
    const reversedRecentMessages = [];
    for (let i = totalMessageCount - 1; i >= contextStartIndex; i -= 1) {
      reversedRecentMessages.unshift(messages[i]);
      const usageInfo = new GPTTokens({ model, messages: reversedRecentMessages });
      const tokenCount = usageInfo.promptUsedTokens;
      if (tokenCount > 4001) {
        break;
      }
    }

    const longTermMemoryPrompts = [{ role: 'system', content: '这是历史聊天总结作为前情提要：' + summary.content }];
    // concat all messages
    const recentMessages = [...longTermMemoryPrompts, ...reversedRecentMessages];
    return { messages: recentMessages, summary };
  }

  async updateSummary(id: string, index: number, content: string) {
    await this.summaryModel.findByIdAndUpdate(id, { index, content });
  }

  async addSummary(summary: ISummary, messages: Message[], model: any, chat: string) {
    const summarizeIndex = summary ? summary.index : 0;
    const toBeSummarizedMsgs = messages.slice(summarizeIndex);

    const usageInfo = new GPTTokens({ model, messages });
    const tokenCount = usageInfo.promptUsedTokens;

    console.log(tokenCount, 'tokenCount');
    if (tokenCount < 3000) {
      return;
    }

    if (summary) {
      toBeSummarizedMsgs.unshift({
        role: 'system',
        content: summary.content,
      });
    }
    toBeSummarizedMsgs.push({
      role: 'system',
      content: '简要总结一下对话内容，用作后续的上下文提示 prompt，控制在 200 字以内',
    });

    // add memory prompt

    const res = await this.gptService.conversation(toBeSummarizedMsgs, model, false);
    const content = res.data?.choices?.at(0)?.message?.content ?? '';
    console.log(content, 'content');
    const summaryContent = content;
    if (summary) {
      await this.summaryModel.findById(summary._id, { index: messages.length, context: summaryContent });
    } else {
      console.log(chat, summaryContent, messages.length, 'sss');
      await this.summaryModel.create({ chat, content: summaryContent, index: messages.length });
    }
  }
}
