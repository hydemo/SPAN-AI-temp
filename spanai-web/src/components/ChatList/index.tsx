import { ChatItem } from './ChatItem';
import { ChatInfo } from './types';

type Props = {
  narrow?: boolean;
  chatId: string;
  data: ChatInfo[];
  onSetSelectedChatId: (chatId: string) => void;
};

export const ChatList = ({ chatId, data, onSetSelectedChatId }: Props) => {
  return data?.map((item, index) => (
    <ChatItem
      key={index}
      chatId={chatId}
      data={item}
      onSetSelectedChatId={onSetSelectedChatId}
    />
  ));
};
