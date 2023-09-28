import { UploadOutlined } from '@ant-design/icons';
import { Upload, message, notification } from 'antd';
import cookies from 'js-cookie';
import { useCallback } from 'react';

import { IconButton } from '@/components/IconButton';
import { baseURL } from '@/utils/config';

type HideLoading = () => void;
let hideLoading: HideLoading;

export const UploadFile = () => {
  const handleChange = useCallback((info: any) => {
    if (info.file.status === 'done') {
      hideLoading();
      message.success('上传成功');
    } else if (info.file.status === 'error') {
      hideLoading();
      // 错误处理，应该要 apiList 统一处理
      notification.error({
        message: '错误',
        description: '上传错误',
        duration: 5,
      });
    }
  }, []);

  const token = cookies.get('web_access_token');
  const props: any = {
    name: 'file',
    multiple: false,
    action: `${baseURL}/user/template/upload`,
    headers: {
      enctype: 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
    beforeUpload: (file: any) => {
      hideLoading = message.loading({
        content: '上传中...',
        key: 'uploadReport',
        duration: 0,
      });
    },
    onChange: handleChange,
    // fileList: [],
    itemRender: () => null,
  };

  return (
    <Upload {...props}>
      <IconButton
        icon={<UploadOutlined style={{ fontSize: '18px' }} />}
        text="上传报告"
        shadow
      />
    </Upload>
  );
};
