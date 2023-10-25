import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RedisService } from 'nest-redis';
import { ConfigService } from 'src/config/config.service';

import { OpenaiPath } from './constant';

const isProduction = process.env.NODE_ENV === 'production';

@Injectable()
export class GPTService {
  private apiKeyUsageKey = 'api_key_usage';
  private activeKeyIndexKey = 'active_key_index';
  constructor(readonly config: ConfigService, private redis: RedisService) {}
  // GPT

  // const apiKeys = ['key1', 'key2', 'key3']; // 替换成你的API密钥
  // const activeKeyIndexKey = 'active_key_index';
  // const apiKeyUsageKey = 'api_key_usage';

  async updateApiKeyUsage(apiKey: string) {
    const client = this.redis.getClient();
    const usageKey = `${this.apiKeyUsageKey}_${apiKey}`;
    await client.incr(usageKey);
    await client.expire(usageKey, 120); // 设置使用计数的过期时间
  }

  async getLeastUsedApiKey() {
    const client = this.redis.getClient();
    const apiKeys = this.config.openAIApiKeys;
    const keyCounts = [];
    for (const key of apiKeys) {
      const keyCount = await client.get(`${this.apiKeyUsageKey}_${key}`);

      if (!keyCount) {
        return key;
      } else {
        const intKeyCount = parseInt(keyCount);
        keyCounts.push(intKeyCount);
      }
    }
    const minIndex = keyCounts.indexOf(Math.min(...keyCounts));
    return apiKeys[minIndex]; // 返回最空闲的密钥
  }

  async getNextApiKey() {
    const apiKeys = this.config.openAIApiKeys;
    const client = this.redis.getClient();
    const leastUsedKey = await this.getLeastUsedApiKey();
    const nextIndex = apiKeys.indexOf(leastUsedKey);

    if (nextIndex !== -1) {
      await client.set(this.activeKeyIndexKey, nextIndex);
      return leastUsedKey;
    } else {
      // 如果找不到最空闲的密钥，默认按顺序选择下一个密钥
      const currentIndex = (await client.get(this.activeKeyIndexKey)) || '0';
      const nextIndex = (parseInt(currentIndex) + 1) % apiKeys.length;

      await client.set(this.activeKeyIndexKey, nextIndex);
      return apiKeys[nextIndex];
    }
  }

  async getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-requested-with': 'XMLHttpRequest',
    };

    const makeBearer = (token: string) => `Bearer ${token}`;

    // use user's api key first
    const openAIApiKey: string = await this.getNextApiKey();
    await this.updateApiKeyUsage(openAIApiKey);
    headers.Authorization = makeBearer(openAIApiKey);
    return headers;
  }

  async conversation(messages: any, model: string, stream: boolean) {
    const requestPayload = {
      messages,
      stream,
      model: model ? model : 'gpt-3.5-turbo',
      temperature: 0.5,
      presence_penalty: 0,
      frequency_penalty: 0,
      top_p: 1,
    };
    const payload: any = {
      url: `${this.config.openAIBaseUrl}/${OpenaiPath.ChatPath}`,
      method: 'POST',
      data: requestPayload,
      headers: await this.getHeaders(),
    };
    if (stream) {
      payload.responseType = 'stream';
    }
    if (isProduction) {
      payload.proxy = {
        host: '127.0.0.1',
        port: 7890,
      };
    }
    return await axios(payload);
  }

  async models() {
    const res = await axios({
      url: `${this.config.openAIBaseUrl}/${OpenaiPath.ListModelPath}`,
      method: 'GET',
      headers: this.getHeaders(),
      proxy: {
        host: '127.0.0.1',
        port: 7890,
      },
    });
    if (res.data?.data) {
      return res.data.data;
    }
    return '';
  }
}
