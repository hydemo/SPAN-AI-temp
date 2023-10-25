import { ProTable } from '@ant-design/pro-components';
import { Modal } from 'antd';

import {
  getReportList,
  downloadReport,
} from '@/services/apiList/userManagement';

type FormProps = {
  onCancel: () => void;
  visible: boolean;
  userId: string;
};

export default (props: FormProps) => {
  const { onCancel, visible, userId } = props;

  const columns: ProColumns<any>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
    },
    {
      title: '报告名',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: any) => [
        <a
          key="add"
          onClick={() => {
            downloadReport(userId, record.name);
          }}
        >
          下载
        </a>,
      ],
    },
  ];

  const reportList = async () => {
    const data = await getReportList(userId);
    return { data, total: data.length };
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={onCancel}
      title="报告列表"
      width="80%"
      destroyOnClose
    >
      <ProTable
        rowKey="name"
        request={reportList}
        search={false}
        columns={columns}
        pagination={false}
      />
    </Modal>
  );
};
