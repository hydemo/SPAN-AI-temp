// @ts-ignore
/* eslint-disable */
import { getLocale } from 'umi';
import { request, downloadExcel } from '@/utils/request';
import md5 from 'md5';

/** 登录接口 POST /api/login/account */
export async function login(
  body: API.LoginParams,
  options?: { [key: string]: any },
) {
  if (!body.password) {
    return;
  }
  const password = md5(body.password);
  return request({
    url: 'login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { ...body, password },
  });
}

export async function register(data: any) {
  return request({
    url: 'register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ...data,
      password: md5(data.password),
    },
  });
}

export async function getEmailCode(username: string) {
  const language = getLocale();
  return request({
    url: 'email/code',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      username,
      language,
    },
  });
}

export async function verifyEmailCode(data: {
  username: string;
  code: string;
}) {
  return request({
    url: 'email/code',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  });
}

export async function resetPassword(data: {
  username: string;
  password: string;
  token: string;
}) {
  return request({
    url: 'passForget',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  });
}

export async function newPassword(
  oldPass: string,
  newPass: string,
) {
  return request({
    url: `resetPass`,
    method: 'PUT',
    data: { oldPass: md5(oldPass), newPass: md5(newPass) },
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function downloadTemplate() {
  downloadExcel({
    url: 'users/template',
  });
}
