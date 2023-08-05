import { ChatItem } from './ChatItem';
import { ChatInfo } from './types';

const data: ChatInfo[] = [
  {
    title: 'Conversation Summary: Hello Ivan Generate Title',
    count: 2,
    time: '2023-08-05 16:29:09',
  },
];

type Props = {
  narrow: boolean;
};

export const ChatList = ({ narrow }: Props) => {
  return data.map((item, index) => (
    <ChatItem key={index} {...item} selected={false}></ChatItem>
  ));
};
