import { LockOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import md5 from 'md5';

type FormProps = {
  onCancel: () => void;
  onFinish: (password: string) => void;
  visible: boolean;
};

export default (props: FormProps) => {
  const { onFinish, onCancel, visible } = props;
  return (
    <ModalForm
      title="修改密码"
      autoFocusFirstInput
      visible={visible}
      modalProps={{
        destroyOnClose: true,
        onCancel,
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        if (!values.password) {
          return;
        }
        onFinish(md5(values.password));
      }}
    >
      <ProFormText.Password
        name="password"
        fieldProps={{
          size: 'large',
          prefix: <LockOutlined />,
        }}
        placeholder="新密码"
        rules={[
          {
            required: true,
            message: '密码不能为空',
          },
        ]}
      />
    </ModalForm>
  );
};
