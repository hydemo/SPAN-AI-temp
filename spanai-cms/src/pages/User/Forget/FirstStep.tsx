import { LockOutlined, MobileOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormCaptcha,
  ProFormText,
} from '@ant-design/pro-components';
import { message, Button } from 'antd';
import React from 'react';

import { getEmailCode, verifyEmailCode } from '@/services/apiList/user';

type Props = {
  setUserName: (name: string) => void;
  setToken: (token: string) => void;
};

type FormValue = {
  username: string;
  code: string;
};

export const FirstStep: React.FC<Props> = ({ setUserName, setToken }) => {
  const handleVerify = async (values: FormValue) => {
    const token = await verifyEmailCode(values);
    setToken(token);
  };
  return (
    <ProForm
      onFinish={async (values: FormValue) => {
        await handleVerify(values);
        setUserName(values.username);
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
              下一步
            </Button>,
          ];
        },
      }}
    >
      <div style={{ height: 62 }}></div>
      <ProFormText
        fieldProps={{
          size: 'large',
          prefix: <MobileOutlined className={'prefixIcon'} />,
        }}
        name="username"
        placeholder={'邮箱/用户名/手机号'}
        rules={[
          {
            required: true,
            message: '请输入邮箱/用户名/手机号！',
          },
        ]}
      />
      <ProFormCaptcha
        phoneName="username"
        fieldProps={{
          size: 'large',
          prefix: <LockOutlined className={'prefixIcon'} />,
        }}
        captchaProps={{
          size: 'large',
        }}
        placeholder={'请输入验证码'}
        captchaTextRender={(timing, count) => {
          if (timing) {
            return `${count} ${'获取验证码'}`;
          }
          return '获取验证码';
        }}
        name="code"
        rules={[
          {
            required: true,
            message: '请输入验证码！',
          },
        ]}
        onGetCaptcha={async (username) => {
          const email = await getEmailCode(username);
          if (email) {
            message.success(`验证码已发送至${email}`, 3);
          }
        }}
      />
    </ProForm>
  );
};
