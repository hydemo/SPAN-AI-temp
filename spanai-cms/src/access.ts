import { getAdminToken } from './utils/authority';
/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(
  initialState:
    | { currentUser?: API.CurrentUser; isSuperAdmin: boolean }
    | undefined,
) {
  const { currentUser } = initialState ?? {};
  const token = getAdminToken();
  return {
    isSuperAdmin: !!currentUser && currentUser.role === 0,
    needLogin: !!token,
  };
}
