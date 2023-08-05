const isDev = ['localhost', '127.0.0.1'].includes(location.hostname);

export const baseURL = isDev ? 'http://localhost:8801/api' : `${location.origin}/api`;

export const qiniuTokenUrl = baseURL;

export const imageViewList = 'imageView2/2/w/200/q/75|imageslim';
