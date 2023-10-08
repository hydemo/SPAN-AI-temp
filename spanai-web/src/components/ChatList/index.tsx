import { ChatItem } from './ChatItem';
import { ChatInfo } from './types';

import { SortRule } from '@/constant';

type Props = {
  narrow?: boolean;
  chatId: string;
  data: ChatInfo[];
  sortRule?: SortRule;
  onSetSelectedChatId: (chatId: string) => void;
};

export const ChatList = ({
  chatId,
  data,
  sortRule,
  onSetSelectedChatId,
}: Props) => {
  return data?.map((item, index) => (
    <ChatItem
      sortRule={sortRule}
      key={index}
      chatId={chatId}
      data={item}
      onSetSelectedChatId={onSetSelectedChatId}
    />
  ));
};
