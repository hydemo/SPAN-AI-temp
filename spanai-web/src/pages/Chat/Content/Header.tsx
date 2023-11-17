import { stringify } from 'querystring';

import {
  SettingOutlined,
  KeyOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { useResponsive } from 'ahooks';
import { Dropdown, Menu, message } from 'antd';
import type { ItemType } from 'antd/lib/menu/hooks/useItems';
import cookies from 'js-cookie';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { useState } from 'react';
import { history } from 'umi';

import { IconButton } from '@/components/IconButton';
import { ReturnIcon } from '@/components/icons';
import { changePass } from '@/services/apiList/user';

type Props = {
  onShowMobileSideBar: () => void;
  topic: string;
  messages?: any[];
};

export const Header = ({
  onShowMobileSideBar,
  topic = '新的聊天',
  messages,
}: Props) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const responsive = useResponsive();
  const isSmallDevice = !responsive.md;

  if (!messages) {
    return;
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

  const loginOut = async () => {
    // await outLogin();
    const { query = {}, search, pathname } = history.location;
    const { redirect } = query;
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/login' && !redirect) {
      history.push({
        pathname: '/login',
        search: stringify({
          redirect: pathname + search,
        }),
      });
    }
    cookies.remove('web_access_token');
    cookies.remove('web_userinfo');
  };

  const onMenuClick = (event: MenuInfo) => {
    const { key } = event;
    if (key === 'logout') {
      loginOut();
      return;
    }
    if (key === 'resetPassword') {
      setModalVisible(true);
      return;
    }
  };

  const menuHeaderDropdown = (
    <Menu selectedKeys={[]} onClick={onMenuClick} items={menuItems} />
  );

  const handleChangePassword = async (values: any) => {
    await changePass(values);
    message.success('修改成功');
    setModalVisible(false);
  };

  return (
    <div>
      <div className="window-header" data-tauri-drag-region>
        {isSmallDevice && (
          <div className="window-actions">
            <div className={'window-action-button'}>
              <IconButton
                icon={<ReturnIcon />}
                bordered
                title={'查看消息列表'}
                onClick={() => onShowMobileSideBar()}
              />
            </div>
          </div>
        )}
        <div className="window-header-title chat-body-title">
          <div
            className="window-header-main-title chat-body-main-title"
            // onClickCapture={() => setIsEditingMessage(true)}
          >
            {topic}
          </div>
          <div className="window-header-sub-title">
            共 {messages.length} 条对话
          </div>
        </div>
        <div>
          <Dropdown overlay={menuHeaderDropdown}>
            <SettingOutlined
              style={{ color: 'var(--primary)', fontSize: '20px' }}
            />
          </Dropdown>
          {/* {isMobile && (
          <div className="window-action-button">
            <IconButton
              icon={config.tightBorder ? <MinIcon /> : <MaxIcon />}
              bordered
              onClick={() => {
                config.update(
                  (config) => (config.tightBorder = !config.tightBorder),
                );
              }}
            />
          </div>
        )} */}
        </div>
      </div>
      <ModalForm
        modalProps={{ destroyOnClose: true }}
        title="修改密码"
        open={modalVisible}
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
    </div>
  );
};
