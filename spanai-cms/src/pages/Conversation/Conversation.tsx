import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { useRef, useState } from 'react';

import { Download, DownloadProps } from './Download';

import { getConversation } from '@/services/apiList/conversation';
import { getUserList } from '@/services/apiList/userManagement';

export const ConversationList = () => {
  const actionRef = useRef<ActionType>();
  const [downloadProps, setDownloadProps] = useState<DownloadProps>({});

  const getUsers = async ({ username }: { username: string }) => {
    const users = (await getUserList({ username })).data;
    return users.map((item: any) => ({
      label: item.username,
      value: item._id,
    }));
  };

  const columns: ProColumns<any>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
    },
    {
      title: '用户名',
      dataIndex: 'user',
      valueType: 'text',
      fieldProps: { showSearch: true },
      render: (_, record) => record.user?.username,
      request: async (keywords) => getUsers(keywords),
    },
    {
      title: '发送类型',
      dataIndex: 'role',
      valueType: 'select',
      valueEnum: {
        assistant: 'assistant',
        user: 'user',
      },
    },
    {
      title: 'prompt token数',
      dataIndex: 'promptTokens',
      valueType: 'text',
      search: false,
    },
    {
      title: '总token数',
      dataIndex: 'totalTokens',
      valueType: 'text',
      search: false,
    },
    {
      title: '提问时间',
      dataIndex: 'questionTime',
      valueType: 'date',
      search: false,
    },
    {
      title: '提问时间区间',
      dataIndex: 'questionTimeRange',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '回复时间（秒）',
      dataIndex: 'answerTime',
      valueType: 'string',
      search: false,
    },
    {
      title: '消息',
      dataIndex: 'content',
      valueType: 'text',
      width: '700px',
    },
  ];

  const handleRequest = async (params) => {
    const newDownloadParams = {
      user: params.user,
      questionTimeRange: params.questionTimeRange
        ? params.questionTimeRange.toString()
        : '',
      content: params.content,
    };
    setDownloadProps(newDownloadParams);
    return await getConversation({
      ...params,
      questionTimeRange: params.questionTimeRange
        ? params.questionTimeRange.toString()
        : '',
    });
  };

  return (
    <PageContainer>
      <ProTable<API.CompanyListItem, API.PageParams>
        actionRef={actionRef}
        rowKey="_id"
        request={handleRequest}
        columns={columns}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Download key="download" downloadProps={downloadProps} />,
        ]}
      />
    </PageContainer>
  );
};

export default ConversationList;
