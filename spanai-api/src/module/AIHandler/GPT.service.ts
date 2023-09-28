import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from 'src/config/config.service';

import { OpenaiPath } from './constant';

const isProduction = process.env.NODE_ENV === 'production';

@Injectable()
export class GPTService {
  constructor(readonly config: ConfigService) {}
  // GPT

  getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-requested-with': 'XMLHttpRequest',
    };

    const makeBearer = (token: string) => `Bearer ${token}`;

    // use user's api key first
    headers.Authorization = makeBearer(this.config.openAIApiKey);
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
      headers: this.getHeaders(),
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
