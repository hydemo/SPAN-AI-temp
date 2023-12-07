export type MessageInfo = {
  _id: string;
  content: string;
  role: string;
  createdAt: string | number;
  type: MessageType;
};

export enum MessageType {
  Conversation = 'conversation',
  Image = 'image',
  Loading = 'loading',
}

export enum MessageRole {
  User = 'user',
  Assistant = 'assistant',
}
