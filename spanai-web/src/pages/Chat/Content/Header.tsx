import { stringify } from 'querystring';

import { LogoutOutlined } from '@ant-design/icons';
import cookies from 'js-cookie';
import { history } from 'umi';

type Props = {
  topic: string;
  messages?: any[];
};

export const Header = ({ topic = '新的聊天', messages }: Props) => {
  if (!messages) {
    return;
  }

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

  return (
    <div className="window-header" data-tauri-drag-region>
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
      <div className="window-actions">
        <LogoutOutlined onClick={loginOut} />
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
  );
};
