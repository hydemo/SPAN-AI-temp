import { useRequest } from 'ahooks';
import { useEffect, useState } from 'react';

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
  clearSelectedChatId: () => void;
};

export const Content = ({
  chatId,
  refreshChats,
  clearSelectedChatId,
}: Props) => {
  const { scrollRef, setAutoScroll } = useScrollToBottom();
  const [uiMessages, setUIMessages] = useState<MessageInfo[]>([]);
  const [inputMessage, setInputMessage] = useState<MessageInfo[]>([]);
  const onChatBodyScroll = (e: HTMLElement) => {
    const isTouchBottom = e.scrollTop + e.clientHeight >= e.scrollHeight - 10;
    // setHitBottom(isTouchBottom);
    setAutoScroll(isTouchBottom);
  };

  const { data: apiMessages = [], refresh: refreshMessages } = useRequest<
    MessageInfo[],
    any
  >(
    async () => {
      const result = await getMessages({
        chatId,
      });
      setInputMessage([]);
      return result;
    },
    {
      refreshDeps: [chatId],
    },
  );

  useEffect(() => {
    setUIMessages(apiMessages);
  }, [apiMessages]);

  useEffect(() => {
    setUIMessages([...apiMessages, ...inputMessage]);
  }, [inputMessage]);

  return (
    <div className="window-content">
      <div className="chat">
        <Header
          topic={uiMessages?.[0]?.content || '新的聊天'}
          messages={uiMessages}
          clearSelectedChatId={clearSelectedChatId}
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
          <ChatMessageList messages={uiMessages} />
        </div>
        <ChatInput
          refreshChats={refreshChats}
          refreshMessages={refreshMessages}
          chatId={chatId}
          messages={uiMessages}
          setInputMessage={setInputMessage}
          setAutoScroll={setAutoScroll}
        />
      </div>
    </div>
  );
};
