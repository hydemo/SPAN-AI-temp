import { stringify } from 'querystring';

import { LogoutOutlined, KeyOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Menu, Spin, message } from 'antd';
import type { ItemType } from 'antd/lib/menu/hooks/useItems';
import cookies from 'js-cookie';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback, useState } from 'react';
import { history, useModel } from 'umi';

import HeaderDropdown from '../HeaderDropdown';

import styles from './index.less';

import { newPassword } from '@/services/apiList/user';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  // await outLogin();
  const { query = {}, search, pathname } = history.location;
  const { redirect } = query;
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.push({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname + search,
      }),
    });
  }
  cookies.remove('admin_access_token');
  cookies.remove('admin_userinfo');
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
        loginOut();
        return;
      }
      if (key === 'resetPassword') {
        setModalVisible(true);
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  const name = currentUser?.username || currentUser?.email;

  if (!name) {
    return loading;
  }

  const menuItems: ItemType[] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
    {
      key: 'resetPassword',
      icon: <KeyOutlined />,
      label: '修改密码',
    },
  ];

  const menuHeaderDropdown = (
    <Menu
      className={styles.menu}
      selectedKeys={[]}
      onClick={onMenuClick}
      items={menuItems}
    />
  );

  const handleChangePassword = async (values: any) => {
    const res = await newPassword(values.oldPass, values.newPass);
    if (res) {
      message.success('修改成功');
      return true;
    }
  };

  return (
    <>
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          {/* <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" /> */}
          <span className={`${styles.name} anticon`}>{name}</span>
        </span>
      </HeaderDropdown>
      <ModalForm
        modalProps={{ destroyOnClose: true }}
        title="修改密码"
        visible={modalVisible}
        onVisibleChange={setModalVisible}
        onFinish={handleChangePassword}
      >
        <ProFormText.Password
          name="oldPass"
          label="旧密码"
          required
          rules={[
            {
              required: true,
              message: '请输入旧密码',
            },
          ]}
        />
        <ProFormText.Password
          name="newPass"
          label="新密码"
          required
          rules={[
            {
              required: true,
              message: '请输入新密码',
            },
          ]}
        />
        <ProFormText.Password
          name="ConfirmPass"
          label="确认密码"
          required
          dependencies={['newPass']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '请确认新密码!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPass') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次密码输入不一致!'));
              },
            }),
          ]}
        />
      </ModalForm>
    </>
  );
};

export default AvatarDropdown;
