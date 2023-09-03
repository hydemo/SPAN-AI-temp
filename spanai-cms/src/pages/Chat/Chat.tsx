import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { useRef } from 'react';

import { getChats } from '@/services/apiList/chat';

export const ChatList = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<any>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
    },
    {
      title: '用户名',
      dataIndex: ['user', 'username'],
      valueType: 'text',
    },
    {
      title: '对话标题',
      dataIndex: 'name',
      valueType: 'text',
      width: '700px',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'date',
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.CompanyListItem, API.PageParams>
        actionRef={actionRef}
        rowKey="_id"
        request={getChats}
        columns={columns}
        search={{
          labelWidth: 120,
        }}
        // toolBarRender={() => [
        //   <Button
        //     key="button"
        //     icon={<PlusOutlined />}
        //     onClick={() => {
        //       setCreateModal(true);
        //       setType('Add');
        //     }}
        //     type="primary"
        //   >
        //     新建
        //   </Button>,
        // ]}
      />
    </PageContainer>
  );
};

export default ChatList;
