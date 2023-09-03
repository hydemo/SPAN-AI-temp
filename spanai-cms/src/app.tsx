import type { Settings as LayoutSettings } from '@ant-design/pro-components';
// import { SettingDrawer } from '@ant-design/pro-components';
import cookies from 'js-cookie';
import { parse } from 'query-string';
import type { RunTimeLayoutConfig } from 'umi';
import { history, setLocale } from 'umi';

import defaultSettings from '../config/defaultSettings';

import { getAdminToken } from './utils/authority';

import RightContent from '@/components/RightContent';

const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
// export const initialStateConfig = {
//   loading: <PageLoading />,
// };

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  setLocale('zh-CN');
  const query = parse(history.location.search);
  const { mode } = query as {
    mode: string;
  };
  if (mode === 'QRCode') {
    cookies.set('mode', mode);
  }
  const fetchUserInfo = async () => {
    const userinfo: string | undefined = cookies.get('admin_userinfo');
    if (mode === 'QRCode') {
      return {};
    }
    if (!userinfo) {
      return history.push(loginPath);
    }
    return JSON.parse(userinfo);
  };

  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    // footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      const token = getAdminToken();
      // 如果没有登录，重定向到 login
      if (!token && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children: React.ReactNode, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {/* {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )} */}
        </>
      );
    },
    ...initialState?.settings,
  };
};
