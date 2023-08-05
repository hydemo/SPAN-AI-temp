// @ts-ignore
/* eslint-disable */
import { getLocale } from 'umi';
import { request } from '@/utils/request';

export async function getChats(options?: { [key: string]: any }) {
  return request({
    url: 'chats',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: options,
  });
}