import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { useRef } from 'react';

import { getConversation } from '@/services/apiList/conversation';

export const ConversationList = () => {
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
      title: '发送类型',
      dataIndex: 'role',
      valueType: 'text',
    },
    {
      title: 'prompt token数',
      dataIndex: 'promptTokens',
      valueType: 'text',
    },
    {
      title: '总token数',
      dataIndex: 'totalTokens',
      valueType: 'text',
    },
    {
      title: '消息',
      dataIndex: 'content',
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
        request={getConversation}
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

export default ConversationList;
