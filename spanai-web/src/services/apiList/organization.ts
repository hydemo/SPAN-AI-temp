import { request } from '@/utils/request';

export async function getOrganization(id: string) {
  const result = await request({
    url: `organization/${id}/departments`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return result;
}

export async function getDepartmentTree(id: string) {
  const result = await request({
    url: `organization/${id}/tree`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return result;
}
