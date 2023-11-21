import cookies from 'js-cookie';

import { ChatType } from '@/constant';
import { request } from '@/utils/request';

export async function getChats(type?: ChatType) {
  const token = cookies.get('web_access_token');
  if (!token) {
    return [];
  }
  return request({
    url: 'chats',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      type,
    },
  });
}

export async function newChats(data: { name: string; type?: ChatType }) {
  return request({
    url: 'chats',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  });
}

export async function getMessages(params: { chatId: string }) {
  const token = cookies.get('web_access_token');
  if (!token) {
    return [];
  }
  return request({
    url: 'conversations',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params,
  });
}

type SendMessageData = {
  content: string;
  model: string;
  parent: string;
  chatId: string;
};

export async function sendMessages(data: SendMessageData) {
  return request({
    url: 'conversations',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      // 'Content-Type': 'text/event-stream', // 设置请求头为 text/event-stream
    },
    data,
    responseType: 'stream',
  });
}

export async function sendImageMessages(data: SendMessageData) {
  return request({
    url: 'conversations',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  });
}
