import { notification } from 'antd';
import axios from 'axios';
import cookies from 'js-cookie';
import { history } from 'umi';

import { baseURL } from './config';

const getLocale = () => 'zh-CN';

export const apiErrorHandler = (status: number, code?: string) => {
  if (status === 401) {
    cookies.remove('web_access_token');
    // @HACK
    /* eslint-disable no-underscore-dangle */
    setTimeout(() => {
      history.push('/login');
    }, 2000);

    return {};
  }
  // environment should not be used
  if (status === 403) {
    notification.error({
      message: `请求错误 ${status}`,
      description: '无访问权限',
      duration: 2,
    });
    return {};
  }
  if (status <= 504 && status >= 500) {
    notification.error({
      message: `请求错误 ${status}`,
      description: '服务器异常',
      duration: 2,
    });
    return {};
  }
  if (code) return {};
  if (status >= 404 && status < 422) {
    return {};
  }
  return {};
};

export async function request(options: any) {
  const { headers, extendUrl, responseType } = options;
  const axiosReq: any = axios.create({
    timeout: 30000,
    baseURL: extendUrl || baseURL,
  });

  if (responseType) {
    axiosReq.responseType = responseType;
  }

  if (headers) {
    axiosReq.headers = {
      ...axiosReq.headers,
      ...headers,
    };
  }
  /* eslint no-param-reassign:0 */
  axiosReq.interceptors.request.use((params: any) => {
    if (window.location.pathname.indexOf('/login') < 0) {
      const token = cookies.get('web_access_token');
      if (token) {
        params.headers = {
          ...params.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }
    return params;
  });

  axiosReq.interceptors.response.use(
    (response: any) => {
      if (response.status >= 200 && response.status < 300) {
        return response.data || response.data || true;
      }
      return {};
    },
    (e: any) => {
      const { response } = e;
      let code;
      if (response.data.statusCode && response.data.statusCode > 10000) {
        code = true;
      }

      const errortext = code ? response.data.message : '';

      const error: any = new Error(errortext);
      if (response.status >= 400 && response.status < 422) {
        notification.error({
          message: `请求错误 ${response.status}`,
          description: errortext,
          duration: 2,
        });
      }
      error.name = response.status;
      error.response = response;
      error.code = code;
      throw error;
    },
  );

  return axiosReq(options).catch((e: any) => {
    const status = e.name;
    return apiErrorHandler(status, e.code);
  });
}

export async function downloadExcel(options: any) {
  const language = getLocale();
  const token = cookies.get('web_access_token');
  axios
    .get(`${baseURL}/${options.url}`, {
      params: {
        language,
        ...options.params,
      },
      responseType: 'blob', // 响应类型为流
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((resp: any) => {
      if (resp.data) {
        const fileName = decodeURI(
          resp.headers['content-disposition'].replace(
            'attachment; filename=',
            '',
          ),
        );
        const blob = new Blob([resp.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click(); // 点击下载
        link.remove();
        window.URL.revokeObjectURL(link.href); // 用完之后使用URL.revokeObjectURL()释放；
      }
    })
    .catch(() => {
      notification.error({
        message: `请求错误 ${status}`,
        description: '服务器异常',
        duration: 2,
      });
    });
}
