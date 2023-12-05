import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef, useState } from 'react';

import CreateForm from './CreateForm';

import { getGptFiles, createGptFiles } from '@/services/apiList/gptFiles';

export const ChatList = () => {
  const actionRef = useRef<ActionType>();
  const [createModal, setCreateModal] = useState<boolean>(false);

  const columns: ProColumns<any>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
    },
    {
      title: '文件名',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '文件id',
      dataIndex: 'fileId',
      valueType: 'text',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'date',
      search: false,
    },
  ];

  const handleAdd = async (props) => {
    const { name, filename } = props;
    console.log(filename, 'props');
    await createGptFiles(name, filename[0].response);
    setCreateModal(false);
    actionRef.current?.reload();
  };

  return (
    <PageContainer>
      <ProTable<API.CompanyListItem, API.PageParams>
        actionRef={actionRef}
        rowKey="_id"
        request={getGptFiles}
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
