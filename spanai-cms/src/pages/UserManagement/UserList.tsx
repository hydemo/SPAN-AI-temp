import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { Popconfirm, message, Tag, Button } from 'antd';
import { useRef, useState } from 'react';

import ChangePassword from './ChangePassword';
import CreateForm from './CreateForm';

import {
  getUserList,
  deleteUser,
  changePassword,
  createUser,
  updateUser,
} from '@/services/apiList/userManagement';

export const UserList = () => {
  const actionRef = useRef<ActionType>();
  const [createModal, setCreateModal] = useState<boolean>(false);
  const [passwordModal, setPasswordModal] = useState<boolean>(false);
  const [row, setRow] = useState<any>({});
  const [type, setType] = useState<'Add' | 'Edit'>('Add');

  const columns: ProColumns<any>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      valueType: 'text',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
    },
    {
      title: '支持模型',
      dataIndex: 'models',
      valueType: 'text',
      render: (_: any, record) => {
        return record.models
          ? record.models.map((item: string) => <Tag key={item}>{item}</Tag>)
          : null;
      },
      search: false,
    },
    {
      title: '单个问题最大token',
      dataIndex: 'singleQuestionToken',
      valueType: 'text',
      search: false,
    },
    {
      title: '问题数',
      dataIndex: 'questionCount',
      valueType: 'text',
      search: false,
    },
    {
      title: '过期时间',
      dataIndex: 'expired',
      valueType: 'date',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: any) => [
        <a
          key="add"
          onClick={() => {
            setCreateModal(true);
            setType('Edit');
            setRow(record);
          }}
        >
          修改
        </a>,
        <Popconfirm
          key="delete"
          title="确定要删除账号吗？"
          onConfirm={async () => {
            const res: any = await deleteUser(record._id);
            if (res) {
              message.success('删除成功');
              actionRef.current?.reload();
            }
          }}
        >
          <a>删除</a>
        </Popconfirm>,
        <a
          key="password"
          onClick={() => {
            setPasswordModal(true);
            setRow(record);
          }}
        >
          修改密码
        </a>,
      ],
    },
  ];

  const handleAddOrEdit = async (user) => {
    if (type === 'Add') {
      await createUser(user);
    } else {
      await updateUser(row._id, user);
    }
    setCreateModal(false);
    setType('Add');
    actionRef.current.reload();
  };

  const handleChangePassword = async (password: string) => {
    const res: any = await changePassword(row._id, password);
    if (res) {
      setPasswordModal(false);
      message.success('修改成功');
    }
  };

  return (
    <PageContainer>
      <ProTable<API.CompanyListItem, API.PageParams>
        actionRef={actionRef}
        rowKey="_id"
        request={getUserList}
        columns={columns}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setCreateModal(true);
              setType('Add');
            }}
            type="primary"
          >
            新建
          </Button>,
        ]}
      />
      <ChangePassword
        onCancel={() => setPasswordModal(false)}
        onFinish={handleChangePassword}
        visible={passwordModal}
      />
      <CreateForm
        onCancel={() => setCreateModal(false)}
        onFinish={handleAddOrEdit}
        visible={createModal}
        type={type}
        record={row}
      />
    </PageContainer>
  );
};

export default UserList;