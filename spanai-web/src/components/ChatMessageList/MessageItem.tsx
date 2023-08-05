import moment from 'moment';

import { MessageInfo } from './types';

type Props = { data: MessageInfo };

export const MessageItem = ({ data: { role, content, createdAt } }: Props) => {
  const isUser = role === 'user';

  return (
    <div className={isUser ? 'chat-message-user' : 'chat-message'}>
      <div className="chat-message-container">
        <div className="chat-message-item">{content}</div>
        <div className="chat-message-action-date">
          {moment(createdAt).format('YYYY-MM-DD HH:mm:ss')}
        </div>
      </div>
    </div>
  );
};
