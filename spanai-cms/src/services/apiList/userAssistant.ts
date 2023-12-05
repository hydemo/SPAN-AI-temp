// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

export async function getUserAssistants(options?: { [key: string]: any }) {
  return request({
    url: 'userAssistants',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: options,
  });
}

export async function createUserAssistants(body: any) {
  return request({
    url: 'userAssistants',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}