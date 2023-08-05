// import { Injectable } from '@nestjs/common';
// import { ConfigService } from 'src/config/config.service';

// @Injectable()
// export class GPTService {
//   constructor(config: ConfigService) {}
//   // GPT

//   getHeaders() {
//     const headers: Record<string, string> = {
//       'Content-Type': 'application/json',
//       'x-requested-with': 'XMLHttpRequest',
//     };

//     const makeBearer = (token: string) => `Bearer ${token.trim()}`;

//     // use user's api key first
//     headers.Authorization = makeBearer(accessStore.token);
//     return headers;
//   }

//   // async Conversation(messages: any) {}
// }
