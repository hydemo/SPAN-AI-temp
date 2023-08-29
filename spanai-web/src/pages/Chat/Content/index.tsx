import { useRequest } from 'ahooks';
import { useState } from 'react';

import { ChatInput } from './ChatInput';
import { Header } from './Header';
import { useScrollToBottom } from './useScrollToBottom';

import { ChatMessageList } from '@/components/ChatMessageList';
import { MessageInfo } from '@/components/ChatMessageList/types';
import { getMessages } from '@/services/apiList/chat';

import './content.scss';

type Props = {
  chatId: string;
  refreshChats: () => void;
};

export const Content = ({ chatId, refreshChats }: Props) => {
  const { scrollRef, setAutoScroll } = useScrollToBottom();
  const [inputMessage, setInputMessage] = useState<MessageInfo[]>([]);
  const onChatBodyScroll = (e: HTMLElement) => {
    const isTouchBottom = e.scrollTop + e.clientHeight >= e.scrollHeight - 10;
    // setHitBottom(isTouchBottom);
    setAutoScroll(isTouchBottom);
  };

  const { data: messages, refresh: refreshMessages } = useRequest<
    MessageInfo[],
    any
  >(
    () =>
      getMessages({
        chatId,
      }),
    {
      refreshDeps: [chatId],
    },
  );

  return (
    <div className="window-content">
      <div className="chat">
        <Header
          topic={messages?.[0]?.content || '新的聊天'}
          messages={messages}
        />
        <div
          className="chat-body"
          ref={scrollRef}
          onScroll={(e) => onChatBodyScroll(e.currentTarget)}
          // onWheel={(e) => setAutoScroll(e.deltaY > 0)}
          onTouchStart={() => {
            setAutoScroll(false);
          }}
        >
          <ChatMessageList
            messages={messages ? [...messages, ...inputMessage] : inputMessage}
          />
        </div>
        <ChatInput
          refreshChats={refreshChats}
          refreshMessages={refreshMessages}
          chatId={chatId}
          messages={messages}
          setInputMessage={setInputMessage}
          setAutoScroll={setAutoScroll}
        />
      </div>
    </div>
  );
};
