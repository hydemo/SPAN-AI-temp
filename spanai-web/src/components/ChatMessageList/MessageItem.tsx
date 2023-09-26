import moment from 'moment';
import 'katex/dist/katex.min.css';
import ReactMarkdown from 'react-markdown';
import RehypeHighlight from 'rehype-highlight';
import RehypeKatex from 'rehype-katex';
import RemarkBreaks from 'remark-breaks';
import RemarkGfm from 'remark-gfm';
import RemarkMath from 'remark-math';

import { MessageInfo } from './types';

type Props = { data: MessageInfo };

export const MessageItem = ({ data: { role, content, createdAt } }: Props) => {
  const isUser = role === 'user';

  return (
    // <div className={isUser ? 'chat-message-user' : 'chat-message'}>
    //   <div className="chat-message-container">
    //     <div className="chat-message-item">{content}</div>
    //     <div className="chat-message-action-date">
    //       {moment(createdAt).format('YYYY-MM-DD HH:mm:ss')}
    //     </div>
    //   </div>
    // </div>
    <div className={isUser ? 'chat-message-user' : 'chat-message'}>
      <div className="chat-message-container">
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
        <div className="chat-message-action-date">
          {moment(createdAt).format('YYYY-MM-DD HH:mm:ss')}
        </div>
      </div>
    </div>
  );
};
