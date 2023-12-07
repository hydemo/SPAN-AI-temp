import { fetchEventSource } from '@fortaine/fetch-event-source';
import { useDebounceEffect } from 'ahooks';
import { notification } from 'antd';
import cookies from 'js-cookie';
import { useRef, useState } from 'react';

import { autoGrowTextArea } from './utils';

import {
  MessageInfo,
  MessageRole,
  MessageType,
} from '@/components/ChatMessageList/types';
import { IconButton } from '@/components/IconButton';
import { SendWhiteIcon } from '@/components/icons';
import { LoadingSpin } from '@/components/LoadingSpin';
import { ChatType } from '@/constant';
import { sendAssistantMessage } from '@/services/apiList/assistants';
import {
  SendMessageData,
  newChats,
  sendImageMessages,
} from '@/services/apiList/chat';
import { getUserUsage } from '@/services/apiList/user';
import {
  LimitError,
  checkUserUsageLimitError,
} from '@/utils/checkUserUsageLimitError';
import { baseURL } from '@/utils/config';
import { requestCatchErrorHandler, requestErrorHandler } from '@/utils/request';

type Props = {
  chatId: string;
  chatType?: ChatType;
  messages: MessageInfo[];
  refreshChats: () => void;
  refreshMessages: () => void;
  setAutoScroll: (value: boolean) => void;
  setInputMessage: (message: MessageInfo[]) => void;
  onSetSelectedChatId: (id: string) => void;
};

export const ChatInput = ({
  chatId,
  chatType,
  messages,
  refreshChats,
  refreshMessages,
  setAutoScroll,
  setInputMessage,
  onSetSelectedChatId,
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

  const onMessageSuccess = (requestChatId: string) => {
    setTimeout(() => {
      if (!chatId) {
        onSetSelectedChatId(requestChatId);
      } else {
        refreshMessages();
      }
      refreshChats();
    }, 1000);
  };

  const sendAssistantsMessage = async (requestPayload: SendMessageData) => {
    const { chatId, content } = requestPayload;
    try {
      await sendAssistantMessage({
        assistant: chatId,
        content,
      });
      onMessageSuccess(chatId);
    } finally {
      setLoading(false);
    }
  };

  const sendImageFlow = async (requestPayload: SendMessageData) => {
    try {
      await sendImageMessages(requestPayload);
      onMessageSuccess(requestPayload.chatId);
    } finally {
      setLoading(false);
    }
  };

  const doSubmit = async (userInput: string) => {
    setUserInput('');
    if (userInput.length === 0 || loading) {
      return;
    }

    let newConversationId: string = '';
    if (!chatId) {
      const { _id } = await newChats({
        name: userInput,
        type: chatType,
      });
      newConversationId = _id;
    }

    setLoading(true);
    const userUsage = await getUserUsage();
    const checkResult = checkUserUsageLimitError({
      userUsage,
      userInput,
      messages,
    });
    if (checkResult) {
      const messageMap: any = {
        [LimitError.IsExpired]: '用户已过期, 请联系管理员!',
        [LimitError.IsUserQuestionExceedLimit]: '提问数已达限制, 请联系管理员!',
        [LimitError.IsSingleQuestionExceedLimit]:
          '单个问题超出token数限制, 请简化提问方式!',
        [LimitError.IsChatQuestionExceedLimit]:
          '单个聊天窗口超出token数限制, 请联系管理员!',
      };
      notification.error({
        message: '错误',
        description: messageMap[checkResult] || checkResult,
        duration: 5,
      });
      setLoading(false);
      return;
    }
    setInputMessage([
      {
        content: userInput,
        role: MessageRole.User,
        _id: '1',
        createdAt: Date.now(),
        type: chatType || (MessageType.Conversation as any),
      },
      {
        content: '回复中...',
        role: MessageRole.Assistant,
        _id: '2',
        createdAt: '',
        type: MessageType.Loading,
      },
    ]);
    setAutoScroll(true);
    // await sendGPTMessages({ userInput, chatId, messages }, setInputMessage);

    let responseText = '';
    const requestChatId = chatId || newConversationId;

    const requestPayload: SendMessageData = {
      content: userInput,
      model: 'gpt-3.5-turbo',
      chatId: requestChatId,
      parent: messages?.[messages?.length - 1]?._id || requestChatId,
    };

    if (chatType === ChatType.Assistant) {
      return sendAssistantsMessage(requestPayload);
    }
    if (chatType === ChatType.Image) {
      return sendImageFlow(requestPayload);
    }

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
      async onopen(response) {
        if (response.ok) {
          return; // everything's good
        }
        response.data = await response.json();
        try {
          requestErrorHandler(response);
        } catch (error) {
          requestCatchErrorHandler(error);
        }
      },
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
            setInputMessage((inputMessages: MessageInfo[]) => {
              let temp = [...inputMessages];
              if (temp[1]) {
                temp[1].role = MessageRole.Assistant;
                temp[1].content = responseText;
                temp[1].type = MessageType.Conversation;
              } else if (temp[0]) {
                temp.push({
                  content: responseText,
                  role: MessageRole.Assistant,
                  _id: '2',
                  type: MessageType.Conversation,
                  createdAt: '',
                });
              }
              return temp;
            });
          }
        } catch (e) {
          console.error('[Request] parse error', text, msg);
        }
      },
      async onclose() {
        onMessageSuccess(requestChatId);
        setLoading(false);
      },
      onerror(e) {
        setLoading(false);
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
          icon={loading ? <LoadingSpin /> : <SendWhiteIcon />}
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
