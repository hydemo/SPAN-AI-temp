import { LockOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormText,
  ProFormDigit,
  ProFormDatePicker,
  ProFormSelect,
} from '@ant-design/pro-components';
import md5 from 'md5';
import moment from 'moment';

type FormProps = {
  onCancel: () => void;
  onFinish: (user: any) => void;
  visible: boolean;
  type: 'Add' | 'Edit';
  records: any;
};

export default (props: FormProps) => {
  const { onFinish, onCancel, visible, type, record } = props;
  return (
    <ModalForm
      title={type === 'Add' ? '新增' : '修改'}
      initialValues={record}
      autoFocusFirstInput
      visible={visible}
      modalProps={{
        destroyOnClose: true,
        onCancel,
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        const newUsers = { ...values };
        if (newUsers.password) {
          newUsers.password = md5(values.password);
        }
        onFinish(newUsers);
      }}
    >
      <ProFormText
        name="username"
        label="用户名"
        placeholder="用户名"
        rules={[
          {
            required: true,
            message: '用户名不能为空',
          },
        ]}
      />
      <ProFormText
        name="email"
        label="邮箱"
        placeholder="邮箱"
        rules={[
          {
            required: true,
            message: '邮箱不能为空',
          },
        ]}
      />
      {type === 'Add' && (
        <ProFormText.Password
          name="password"
          label="密码"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined />,
          }}
          placeholder="密码"
          rules={[
            {
              required: true,
              message: '密码不能为空',
            },
          ]}
        />
      )}
      <ProFormSelect
        name="model"
        label="模型"
        request={async () => [
          { label: 'gpt-3.5-turbo', value: 'gpt-3.5-turbo' },
          { label: 'gpt-4', value: 'gpt-4' },
        ]}
        placeholder="请选择模型"
        rules={[{ required: true, message: '请选择模型' }]}
      />
      <ProFormDigit
        label="单个问题最大token数"
        name="singleQuestionToken"
        style={{ width: '100%' }}
        min={1}
      />
      <ProFormDigit
        label="问题数"
        name="questionCount"
        style={{ width: '100%' }}
        min={1}
      />
      <ProFormDatePicker
        fieldProps={{
          format: 'YYYY-MM-DD',
          disabledDate: (current) => current && current < moment().endOf('day'),
        }}
        name="expired"
        label="过期时间"
      />
    </ModalForm>
  );
};
