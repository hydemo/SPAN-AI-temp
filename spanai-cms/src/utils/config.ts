export const isDev = ['localhost', '127.0.0.1'].includes(location.hostname);

export const baseURL = isDev
  ? `http://${location.hostname}:8001/admin`
  : `${location.origin}/admin`;

export const webUrl = isDev
  ? `http://${location.hostname}:5001`
  : location.origin;

export const qiniuDownUrl = 'http://qn.greatwebtech.cn';
export const qiniuTokenUrl = baseURL;

export const imageViewList = 'imageView2/2/w/200/q/75|imageslim';
export const qiniuUrl = 'https://up-cn-east-2.qiniup.com';

export const mobileViewUserToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNTNlMjczYzE4YTZmZWU1NGIwZjU0NyIsInR5cGUiOiJhZG1pbiIsImlhdCI6MTY3OTM5NzM4MywiZXhwIjoxNjgwMDAyMTgzfQ.8SJQajECd9upMp2PWO-NZhQRzdBQxjIZ4EP73LlyQcs';
export const prefix = isDev ? '' : '/cms';
