import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import cookies from 'js-cookie';
import { parse } from 'query-string';
import React from 'react';
import { history, useModel } from 'umi';

import styles from './index.less';

import { login } from '@/services/apiList/user';

const isDev = process.env.NODE_ENV === 'development';

const Login: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  // const layoutActionRef = createRef<{ reload: () => void }>();

  const query = parse(history.location.search);
  const { username, redirect } = query as {
    redirect: string;
    username: string;
  };

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState(() => ({
        ...initialState,
        currentUser: { ...userInfo, userid: userInfo._id },
        // layoutActionRef,
      }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    // 登录
    const msg = await login({ ...values, username: values.username?.trim() });
    if (msg.token) {
      cookies.set('admin_access_token', msg.token);
      cookies.set('admin_userinfo', JSON.stringify(msg.userinfo));
      await fetchUserInfo();
      const initUrl = isDev ? '/' : '/cms';
      window.location.href =
        redirect &&
        (redirect !== '/userManagement/userList' || msg.userinfo?.role === 0)
          ? redirect
          : initUrl;
      return;
    }
  };

  const localhostInitialValues = isDev
    ? {
        username: username || 'spanai',
        password: 'admin',
      }
    : {
        username,
      };

  return (
    <div className={styles.container}>
      {/* <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div> */}
      <div className={styles.content}>
        <LoginForm
          title="SPAN-AI后台管理系统"
          initialValues={{
            ...localhostInitialValues,
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
          actions={
            <>
              还没有账号？
              <a onClick={() => history.push('/user/register')}>注册新账号</a>
            </>
          }
        >
          <div style={{ height: 62 }}></div>
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.prefixIcon} />,
            }}
            placeholder="用户名"
            rules={[
              {
                required: true,
                message: '用户名是必填项！',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon} />,
            }}
            placeholder="密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
              onClick={() => history.push('/user/forget')}
            >
              忘记密码
            </a>
          </div>
        </LoginForm>
      </div>
    </div>
  );
};

export default Login;
