import { LockOutlined } from '@ant-design/icons';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useRef } from 'react';
import { useIntl, history } from 'umi';

import styles from './index.less';

import { resetPassword } from '@/services/apiList/user';

type Props = {
  username: string;
  token: string;
};

export const SecondStep: React.FC<Props> = ({ username, token }) => {
  const formRef = useRef<any>();
  const intl = useIntl();
  const handleReset = async (values: {
    password: string;
    password2: string;
  }) => {
    await resetPassword({
      username,
      password: values.password,
      token,
    });
  };
  return (
    <ProForm
      formRef={formRef}
      onFinish={async (values: any) => {
        await handleReset(values);
        message.success('修改成功');
        setTimeout(
          () => history.push(`/user/login?username=${username}`),
          2000,
        );
      }}
      submitter={{
        render: (props) => {
          return [
            <Button
              type="primary"
              block
              key="submit"
              onClick={() => props.form?.submit?.()}
            >
              重置
            </Button>,
          ];
        },
      }}
    >
      <div style={{ height: 62 }}></div>
      <ProFormText.Password
        name="password"
        fieldProps={{
          size: 'large',
          prefix: <LockOutlined className={styles.prefixIcon} />,
        }}
        placeholder="请输入新密码"
        validateTrigger="onBlur"
        rules={[
          {
            required: true,
            message: '密码不能为空',
          },
        ]}
      />
      <ProFormText.Password
        name="password2"
        fieldProps={{
          size: 'large',
          prefix: <LockOutlined className={styles.prefixIcon} />,
        }}
        placeholder="请确认新密码"
        validateTrigger="onBlur"
        rules={[
          {
            validator: async (rule, value) => {
              if (formRef.current?.getFieldValue('password') !== value) {
                throw new Error('两次密码不一致');
              }
              return true;
            },
          },
        ]}
      />
    </ProForm>
  );
};
