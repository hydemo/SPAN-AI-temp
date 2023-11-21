import { FileImageOutlined, MessageOutlined } from '@ant-design/icons';
import { Space, Radio } from 'antd';

import { ChatType } from '@/constant';

type Props = {
  chatType: ChatType | undefined;
  onChatTypeChange: (value: ChatType) => void;
};

export const ChatTypeSelect = ({ chatType, onChatTypeChange }: Props) => {
  const handleChange = (e: any) => {
    onChatTypeChange(e.target.value);
  };

  return (
    <>
      <Space>
        类型
        <Radio.Group value={chatType} onChange={handleChange}>
          <Radio.Button value={ChatType.Conversation}>
            <Space>
              <MessageOutlined />
              对话
            </Space>
          </Radio.Button>
          <Radio.Button value={ChatType.Image}>
            <Space>
              <FileImageOutlined />
              图片
            </Space>
          </Radio.Button>
        </Radio.Group>
      </Space>
    </>
  );
};
