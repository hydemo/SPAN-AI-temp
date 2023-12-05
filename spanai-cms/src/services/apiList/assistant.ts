// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

export async function getAssistants(options?: { [key: string]: any }) {
  return request({
    url: 'assistants',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: options,
  });
}

export async function createAssistants(body) {
  return request({
    url: 'assistants',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}