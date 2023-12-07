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

type AssistantFile = {
  filename: string;
  name: string;
};

export type AssistantFormValue = {
  name: string;
  instructions: string;
  model: string;
  files: AssistantFile[];
  tools: string[];
};

export const addAssistants = (data: AssistantFormValue) => {
  return request({
    url: 'assistants',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
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
