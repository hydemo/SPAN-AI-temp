import { request } from '@/utils/request';

export async function getQuestionnaires(id: string) {
  const result = await request({
    url: `questionnaires/${id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return result;
}

export async function getQuestionnairesUserFilter(id: string, filterId: string) {
  const result = await request({
    url: `questionnaires/${id}/userfilter/${filterId}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return result;
}

export async function getQuestionnairesTree(id: string) {
  const result = await request({
    url: `questionnaires/${id}/tree`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return result;
}

export async function saveQuestionnairesUserFilter(id: string, filterId: string, data: any[]) {
  const result = await request({
    url: `questionnaires/${id}/userfilter/${filterId}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      filterChoose: data,
    },
  });
  return result;
}

export async function saveQuestionnairesTree(id: string, data: any[]) {
  const result = await request({
    url: `questionnaires/${id}/tree`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      filterChoose: data,
    },
  });
  return result;
}

export async function getWelcome(id: string) {
  const result = await request({
    url: `questionnaires/${id}/welcome`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return result;
}

export async function getChoice(id: string) {
  const result = await request({
    url: `questionnaires/${id}/choice`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return result;
}

export async function getProjectQuestionnaires(projectId: string) {
  const result = await request({
    url: `projects/${projectId}/questionnaires`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return result;
}
