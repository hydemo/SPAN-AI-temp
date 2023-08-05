import cookies from 'js-cookie';

import { mobileViewUserToken } from './config';
// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str: any) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || ['Guest'];
}

export function setAuthority(authority: any) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('authority', JSON.stringify(proAuthority));
}

export function getAdminToken() {
  const mode = cookies.get('mode');
  if (mode === 'QRCode') {
    return mobileViewUserToken;
  }
  return cookies.get('admin_access_token');
}
