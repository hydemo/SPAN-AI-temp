import { Result } from '@/pages/Echarts/type';
import { request } from '@/utils/request';

export async function getProjects() {
  const data = await request({
    url: 'projects',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return data;
}
