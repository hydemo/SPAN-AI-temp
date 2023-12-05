import { request } from '@/utils/request';

export const getAssistants = () => {
  return request({
    url: 'assistants',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const sendAssistantMessage = (data: {
  assistant: string;
  content: string;
}) => {
  return request({
    url: 'assistants/conversation',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  });
};
