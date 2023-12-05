import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef, useState } from 'react';

import CreateForm from './CreateForm';

import { getAssistants, createAssistants } from '@/services/apiList/assistant';

export const ChatList = () => {
  const actionRef = useRef<ActionType>();
  const [createModal, setCreateModal] = useState<boolean>(false);

  const columns: ProColumns<any>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
    },
    {
      title: '助手名称',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '模型',
      dataIndex: 'model',
      valueType: 'text',
    },
    {
      title: '简介',
      dataIndex: 'instructions',
      valueType: 'text',
    },
    {
      title: '文件列表',
      dataIndex: 'files',
      valueType: 'text',
      render: (_, re: any) => re.files.map((item: any) => item.name),
    },
    {
      title: '工具集',
      dataIndex: 'tools',
      valueType: 'text',
      render: (_, re: any) => re.tools.map((item: string) => item),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'date',
      search: false,
    },
  ];

  const handleAdd = async (props) => {
    await createAssistants(props);
    setCreateModal(false);
    actionRef.current?.reload();
  };

  return (
    <PageContainer>
      <ProTable<any>
        actionRef={actionRef}
        rowKey="_id"
        request={getAssistants}
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
