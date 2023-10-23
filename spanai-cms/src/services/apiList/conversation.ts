// @ts-ignore
/* eslint-disable */
import { getLocale } from 'umi';
import { request, downloadExcel } from '@/utils/request';

export async function getConversation(options?: { [key: string]: any }) {
  return request({
    url: 'conversations',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: options,
  });
}

export function download(type, params) {
  downloadExcel({
    url: `conversations/download?type=${type}`,
    params: params
  });
}