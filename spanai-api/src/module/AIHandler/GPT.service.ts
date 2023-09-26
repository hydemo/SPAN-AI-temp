import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from 'src/config/config.service';

import { OpenaiPath } from './constant';

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

  conversation(messages: any, model: string) {
    const requestPayload = {
      messages,
      stream: true,
      model: model ? model : 'gpt-3.5-turbo',
      temperature: 0.5,
      presence_penalty: 0,
      frequency_penalty: 0,
      top_p: 1,
    };
    return axios({
      url: `${this.config.openAIBaseUrl}/${OpenaiPath.ChatPath}`,
      method: 'POST',
      data: requestPayload,
      headers: this.getHeaders(),
      responseType: 'stream',
      // proxy: {
      //   host: '127.0.0.1',
      //   port: 7890,
      // },
    });
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
