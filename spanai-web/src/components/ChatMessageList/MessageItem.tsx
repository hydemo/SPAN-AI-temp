import { Spin } from 'antd';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import RehypeHighlight from 'rehype-highlight';
import RehypeKatex from 'rehype-katex';
import RemarkBreaks from 'remark-breaks';
import RemarkGfm from 'remark-gfm';
import RemarkMath from 'remark-math';

import { LoadingSpin } from '../LoadingSpin';

import { ImageMessageItem } from './ImageMessageItem';
import { MessageInfo, MessageRole, MessageType } from './types';

import 'katex/dist/katex.min.css';

type Props = { data: MessageInfo };

export const MessageItem = ({
  data: { role, content, createdAt, type },
}: Props) => {
  const isUser = role === MessageRole.User;

  const renderMessageContent = () => {
    if (type === MessageType.Loading) {
      return (
        <div className="chat-message-item markdown-body">
          <LoadingSpin />
        </div>
      );
    }
    if (!isUser && type === MessageType.Image) {
      return <ImageMessageItem content={content} />;
    }
    return (
      <div className="chat-message-item markdown-body">
        <ReactMarkdown
          remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
          rehypePlugins={[
            RehypeKatex,
            [
              RehypeHighlight,
              {
                detect: false,
                ignoreMissing: true,
              },
            ],
          ]}
          components={{
            a: (aProps) => {
              const href = aProps.href || '';
              const isInternal = /^\/#/i.test(href);
              const target = isInternal ? '_self' : aProps.target ?? '_blank';
              return <a {...aProps} target={target} />;
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className={isUser ? 'chat-message-user' : 'chat-message'}>
      <div className="chat-message-container">
        {renderMessageContent()}
        <div className="chat-message-action-date">
          {createdAt && moment(createdAt).format('YYYY-MM-DD HH:mm:ss')}
        </div>
      </div>
    </div>
  );
};
