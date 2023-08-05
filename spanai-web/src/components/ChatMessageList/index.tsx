import { MessageItem } from './MessageItem';
import { MessageInfo } from './types';

type Props = {
  messages?: MessageInfo[];
};

export const ChatMessageList = ({ messages }: Props) => {
  return messages?.map((message, index) => (
    <MessageItem key={index} data={message} />
  ));
};
