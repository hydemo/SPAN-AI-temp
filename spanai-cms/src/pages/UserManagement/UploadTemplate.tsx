import { UploadOutlined } from '@ant-design/icons';
import { Upload, message, Button } from 'antd';
import { useCallback, useState } from 'react';

import { getAdminToken } from '@/utils/authority';
import { baseURL } from '@/utils/config';

type Props = {
  onSuccess: () => void;
};

type HideLoading = () => void;
let hideLoading: HideLoading;

export const UploadTemplate: React.FC<Props> = ({ onSuccess }) => {
  const [fileList, setFileList]: any = useState([]);

  const handleChange = useCallback(
    (info: any) => {
      if (info.file.status === 'done') {
        if (hideLoading) {
          hideLoading();
        }
        message.success('上传成功');
        onSuccess();
        setFileList([]);
      } else if (info.file.status === 'error') {
        if (hideLoading) {
          hideLoading();
        }
        setFileList([]);
        onSuccess();
        // 错误处理，应该要 apiList 统一处理
        message.error('上传失败');
      }
    },
    [onSuccess],
  );

  const token = getAdminToken();
  const props: any = {
    name: 'file',
    multiple: false,
    action: `${baseURL}/users/template/upload`,
    headers: {
      enctype: 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
    beforeUpload: (file: any) => {
      hideLoading = message.loading({
        content: '上传中...',
        duration: 0,
      });
      setFileList([file]);
    },
    onRemove: () => setFileList([]),
    onChange: handleChange,
    fileList: fileList,
    disabled: !!fileList.length,
    data: () => {},
  };

  return (
    <Upload {...props} itemRender={() => null}>
      <Button icon={<UploadOutlined />}>上传</Button>
    </Upload>
  );
};
