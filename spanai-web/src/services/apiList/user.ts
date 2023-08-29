// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';
import md5 from 'md5';

/** 登录接口 POST /api/login/account */
export async function login(
  body: API.LoginParams,
  options?: { [key: string]: any },
) {
  const password = md5(body.password);
  return request({
    url: 'user/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { ...body, password },
  });
}

/** 修改密码 */
export async function changePass(
  body: API.ChangePassword,
  options?: { [key: string]: any },
) {
  return request({
    url: 'user/password',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { oldPass: md5(body.oldPass), newPass: md5(body.newPass) },
  });
}

/** 修改姓名 */
export async function changeName(
  fullname: string,
  options?: { [key: string]: any },
) {
  return request({
    url: 'user/fullname',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { fullname },
  });
}
