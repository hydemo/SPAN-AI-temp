import { PictureOutlined, MessageOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import moment from 'moment';

import { ChatInfo } from './types';

import { ChatType, SortRule } from '@/constant';

type Props = {
  chatId: string;
  data: ChatInfo;
  sortRule?: SortRule;
  onSetSelectedChatId: (chatId: string) => void;
};

export const ChatItem = ({
  chatId,
  sortRule,
  data: {
    _id,
    name = '新的聊天',
    conversionCount = 0,
    createdAt,
    updatedAt,
    type,
  },
  onSetSelectedChatId,
}: Props) => {
  const selected = chatId === _id;
  // const handleDelete = () => {};
  const time = sortRule === SortRule.Updated ? updatedAt : createdAt;

  return (
    <div
      className={`chat-item ${selected && 'chat-item-selected'}`}
      onClick={() => onSetSelectedChatId(_id)}
      // ref={(ele) => {
      //   draggableRef.current = ele;
      //   provided.innerRef(ele);
      // }}
      // {...provided.draggableProps}
      // {...provided.dragHandleProps}
      // title={}
    >
      <div className={'chat-item-title'}>
        <Space>
          {type === ChatType.Conversation ? (
            <MessageOutlined />
          ) : (
            <PictureOutlined />
          )}
          {name}
        </Space>
      </div>
      <div className={'chat-item-info'}>
        <div className={'chat-item-count'}>{conversionCount} 条对话</div>
        <div className={'chat-item-date'}>
          {moment(time).format('YYYY-MM-DD HH:mm:ss')}
        </div>
      </div>

      {/* <div className={'chat-item-delete'} onClickCapture={handleDelete}>
        <DeleteIcon />
      </div> */}
    </div>
  );
};
