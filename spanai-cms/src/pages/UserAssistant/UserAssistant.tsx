import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef, useState } from 'react';

import CreateForm from './CreateForm';

import {
  getUserAssistants,
  createUserAssistants,
} from '@/services/apiList/userAssistant';

export const ChatList = () => {
  const actionRef = useRef<ActionType>();
  const [createModal, setCreateModal] = useState<boolean>(false);

  const columns: ProColumns<any>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
    },
    {
      title: '用户',
      dataIndex: ['user', 'username'],
      valueType: 'text',
    },
    {
      title: '助理',
      dataIndex: ['assistant', 'name'],
      valueType: 'text',
    },
  ];

  const handleAdd = async (props) => {
    await createUserAssistants(props);
    setCreateModal(false);
    actionRef.current?.reload();
  };

  return (
    <PageContainer>
      <ProTable<any>
        actionRef={actionRef}
        rowKey="_id"
        request={getUserAssistants}
        columns={columns}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="add"
            icon={<PlusOutlined />}
            onClick={() => {
              setCreateModal(true);
            }}
            type="primary"
          >
            新建
          </Button>,
        ]}
      />
      <CreateForm
        onCancel={() => setCreateModal(false)}
        onFinish={handleAdd}
        visible={createModal}
      />
    </PageContainer>
  );
};

export default ChatList;
