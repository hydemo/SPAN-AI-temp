import { request } from '@/utils/request';

export async function getUserList(options?: { [key: string]: any }) {
  return request({
    url: 'users',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: options,
  });
}

export async function deleteUser(id: string) {
  return request({
    url: `users/${id}`,
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function changePassword(id: string, password: string) {
  return request({
    url: `users/${id}/password`,
    method: 'PUT',
    data: { password },
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function createUser(body: any) {
  return request({
    url: 'users',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

export async function updateUser(id, body: any) {
  return request({
    url: `users/${id}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}
