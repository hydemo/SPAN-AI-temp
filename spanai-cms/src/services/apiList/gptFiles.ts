// @ts-ignore
/* eslint-disable */
import { getLocale } from 'umi';
import { request } from '@/utils/request';

export async function getGptFiles(options?: { [key: string]: any }) {
  return request({
    url: 'gptFiles',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: options,
  });
}

export async function createGptFiles(name: string, filename: string) {
  return request({
    url: 'gptFiles',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { name, filename },
  });
}