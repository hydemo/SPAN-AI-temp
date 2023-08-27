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

  async conversation(messages: any) {
    const requestPayload = {
      messages,
      stream: false,
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      presence_penalty: 0,
      frequency_penalty: 0,
      top_p: 1,
    };
    const res = await axios({
      url: `${this.config.openAIBaseUrl}/${OpenaiPath.ChatPath}`,
      method: 'POST',
      data: requestPayload,
      headers: this.getHeaders(),
      proxy: {
        host: '127.0.0.1',
        port: 7890,
      },
    });
    if (res.data?.choices) {
      return res.data.choices[0].message.content;
    }
    return '';
  }
}
