import { request } from '@/utils/request';

export const getSubject = (id: string) => {
  return request({
    url: `questionnaires/${id}/subject`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const saveSubject = (id: string, data: any) => {
  return request({
    url: `questionnaires/${id}/subject`,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
