import { useRequest } from 'ahooks';
import { Empty } from 'antd';
import { useEffect, useState } from 'react';

import { ChatInput } from './ChatInput';
import { Header } from './Header';
import { useScrollToBottom } from './useScrollToBottom';

import { ChatMessageList } from '@/components/ChatMessageList';
import { MessageInfo } from '@/components/ChatMessageList/types';
import { ChatType } from '@/constant';
import { getConversations } from '@/services/apiList/chat';

import './content.scss';

type Props = {
  chatId: string;
  chatName: string;
  chatType?: ChatType;
  refreshChats: () => void;
  onSetSelectedChatId: (id: string) => void;
  onShowMobileSideBar: () => void;
};

export const Content = ({
  chatId,
  chatType,
  chatName,
  refreshChats,
  onSetSelectedChatId,
  onShowMobileSideBar,
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
      const result = await getConversations({
        chatId,
        type: chatType || ChatType.Conversation,
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

  const needToSelectChatId = !chatId && chatType === ChatType.Assistant;

  return (
    <div className="window-content">
      <div className="chat">
        <Header
          chatId={chatId}
          chatType={chatType}
          topic={chatName || uiMessages?.[0]?.content || '新的聊天'}
          messages={uiMessages}
          onShowMobileSideBar={onShowMobileSideBar}
        />
        {needToSelectChatId ? (
          <>
            <div className="chat-body chat-body_assistant">
              <Empty description="请选择一个助理" />
            </div>
          </>
        ) : (
          <>
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
              chatType={chatType}
              messages={uiMessages}
              setInputMessage={setInputMessage}
              setAutoScroll={setAutoScroll}
              onSetSelectedChatId={onSetSelectedChatId}
            />
          </>
        )}
      </div>
    </div>
  );
};
