import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { useRef } from 'react';

import { Download } from './Download';

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
      title: '提问时间',
      dataIndex: 'questionTime',
      valueType: 'date',
    },
    {
      title: '回复时间（秒）',
      dataIndex: 'answerTime',
      valueType: 'text',
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
        toolBarRender={() => [<Download key="download" />]}
      />
    </PageContainer>
  );
};

export default ConversationList;
