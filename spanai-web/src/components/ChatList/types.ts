import { ChatType } from '@/constant';

export type ChatInfo = {
  _id: string;
  name: string;
  count?: number;
  createdAt: string;
  updatedAt: string;
  type: ChatType;
  conversionCount: number;
};
