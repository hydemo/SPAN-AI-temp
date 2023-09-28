import { LoadingOutlined } from '@ant-design/icons';
import { fetchEventSource } from '@fortaine/fetch-event-source';
import { useDebounceEffect } from 'ahooks';
import { Spin } from 'antd';
import cookies from 'js-cookie';
import { useRef, useState } from 'react';

import { autoGrowTextArea } from './utils';

import { MessageInfo } from '@/components/ChatMessageList/types';
import { IconButton } from '@/components/IconButton';
import { LoadingIcon, SendWhiteIcon } from '@/components/icons';
import { sendMessages } from '@/services/apiList/chat';
import { baseURL } from '@/utils/config';

const antIcon = <LoadingOutlined style={{ fontSize: 18 }} spin />;

type Props = {
  chatId: string;
  messages?: MessageInfo[];
  refreshChats: () => void;
  refreshMessages: () => void;
  setAutoScroll: (value: boolean) => void;
  setInputMessage: (message: MessageInfo[]) => void;
};

const sendGPTMessages = (
  { userInput, chatId, messages },
  setInputMessage,
) => {};

export const ChatInput = ({
  chatId,
  messages,
  refreshChats,
  refreshMessages,
  setAutoScroll,
  setInputMessage,
  inputMessage,
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
    setUserInput('');
    if (userInput.length === 0 || loading) {
      return;
    }
    setInputMessage([
      { content: userInput, role: 'user', _id: '', createdAt: Date.now() },
    ]);
    setLoading(true);
    setAutoScroll(true);
    // await sendGPTMessages({ userInput, chatId, messages }, setInputMessage);

    let responseText = '';

    const requestPayload = {
      content: userInput,
      model: 'gpt-3.5-turbo',
      chatId,
      parent: messages?.[messages?.length - 1]?._id || chatId,
    };

    const chatPath = baseURL + '/conversations';
    const controller = new AbortController();
    const token = cookies.get('web_access_token');
    const chatPayload = {
      method: 'POST',
      body: JSON.stringify(requestPayload),
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'x-requested-with': 'XMLHttpRequest',
        Authorization: `Bearer ${token}`,
      },
    };

    fetchEventSource(chatPath, {
      ...chatPayload,
      onmessage(msg) {
        if (msg.data === '[DONE]') {
          return;
        }
        const text = msg.data;
        try {
          const json = JSON.parse(text);
          const delta = json.choices[0].delta.content;
          if (delta) {
            responseText += delta;
            setInputMessage((inputMessages) => {
              let temp = [...inputMessages];
              if (temp[1]) {
                temp[1].content = responseText;
              } else if (temp[0]) {
                temp.push({
                  content: responseText,
                  role: 'assistant',
                  _id: '',
                  createdAt: Date.now(),
                });
              }
              return temp;
            });
            // console.log(responseText);
          }
        } catch (e) {
          console.error('[Request] parse error', text, msg);
        }
      },
      async onclose() {
        setLoading(false);
        setTimeout(() => {
          refreshMessages();
          refreshChats();
        }, 1000);
      },
      onerror(e) {
        setLoading(false);
        setInputMessage((inputMessages) => {
          let temp = [...inputMessages];
          temp.push({
            content: 'API 返回错误，可能是因为 token 已超出限制',
            role: 'assistant',
            _id: '',
            createdAt: Date.now(),
            type: 'error',
          });
          return temp;
        });
        throw e;
      },
      openWhenHidden: true,
    });
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // if ArrowUp and no userInput, fill with last input
    if (
      e.key === 'ArrowUp' &&
      userInput.length <= 0 &&
      !(e.metaKey || e.altKey || e.ctrlKey)
    ) {
      setUserInput('');
      // setUserInput(localStorage.getItem(LAST_INPUT_KEY) ?? '');
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
      setUserInput('');
      doSubmit(userInput);
      setInputMessage([
        {
          role: 'user',
          createdAt: Date.now(),
          content: userInput,
          _id: '',
        },
      ]);
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
          disabled={loading}
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
          icon={loading ? <Spin indicator={antIcon} /> : <SendWhiteIcon />}
          text={loading ? '回复中' : '发送'}
          className="chat-input-send"
          type="primary"
          disabled={loading || Boolean(userInput.length <= 0)}
          onClick={() => doSubmit(userInput)}
        />
      </div>
    </div>
  );
};
