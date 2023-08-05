import { useDebounceEffect, useRequest } from 'ahooks';
import { useRef, useState } from 'react';

import { autoGrowTextArea } from './utils';

import { MessageInfo } from '@/components/ChatMessageList/types';
import { IconButton } from '@/components/IconButton';
import { SendWhiteIcon } from '@/components/icons';
import { LAST_INPUT_KEY } from '@/constant';
import { sendMessages } from '@/services/apiList/chat';

type Props = {
  chatId: string;
  messages?: MessageInfo[];
  refreshChats: () => void;
  refreshMessages: () => void;
  setAutoScroll: (value: boolean) => void;
};

export const ChatInput = ({
  chatId,
  messages,
  refreshChats,
  refreshMessages,
  setAutoScroll,
}: Props) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [userInput, setUserInput] = useState('');
  const [inputRows, setInputRows] = useState(2);
  const [loading, setLoading] = useState(false);

  useDebounceEffect(
    () => {
      const rows = inputRef.current ? autoGrowTextArea(inputRef.current) : 1;
      const inputRows = Math.min(20, Math.max(2, rows));
      setInputRows(inputRows);
    },
    [userInput],
    {
      wait: 100,
    },
  );

  // const { scrollRef, setAutoScroll, scrollToBottom } = useScrollToBottom();
  const onInput = (text: string) => {
    setUserInput(text);
  };

  const doSubmit = async (userInput: string) => {
    if (userInput.length === 0) {
      return;
    }
    setLoading(true);
    setAutoScroll(true);
    try {
      await sendMessages({
        content: userInput,
        model: 'gpt-3.5-turbo',
        chatId,
        parent: messages?.[messages?.length - 1]?._id || chatId,
      });
      refreshChats();
      refreshMessages();
    } finally {
      setLoading(false);
    }
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // if ArrowUp and no userInput, fill with last input
    if (
      e.key === 'ArrowUp' &&
      userInput.length <= 0 &&
      !(e.metaKey || e.altKey || e.ctrlKey)
    ) {
      setUserInput(localStorage.getItem(LAST_INPUT_KEY) ?? '');
      e.preventDefault();
      return;
    }
    if (
      e.key === 'Enter' &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey &&
      !e.shiftKey &&
      userInput.length > 0
    ) {
      doSubmit(userInput);
      e.preventDefault();
    }
  };
  return (
    <div className="chat-input-panel">
      {/* <ChatActions
        showPromptModal={() => setShowPromptModal(true)}
        scrollToBottom={scrollToBottom}
        hitBottom={hitBottom}
        showPromptHints={() => {
          // Click again to close
          if (promptHints.length > 0) {
            setPromptHints([]);
            return;
          }

          inputRef.current?.focus();
          setUserInput("/");
          onSearch("");
        }}
      /> */}
      <div className={'chat-input-panel-inner'}>
        <textarea
          ref={inputRef}
          className="chat-input"
          // placeholder={Locale.Chat.Input(submitKey)}
          onInput={(e) => onInput(e.currentTarget.value)}
          value={userInput}
          onKeyDown={onInputKeyDown}
          // onFocus={() => setAutoScroll(true)}
          // onBlur={() => setAutoScroll(false)}
          rows={inputRows}
          autoFocus
          style={{
            fontSize: 14,
          }}
        />
        <IconButton
          loading={loading}
          icon={<SendWhiteIcon />}
          text="发送"
          className="chat-input-send"
          type="primary"
          disabled={loading || Boolean(userInput.length <= 0)}
          onClick={() => doSubmit(userInput)}
        />
      </div>
    </div>
  );
};
