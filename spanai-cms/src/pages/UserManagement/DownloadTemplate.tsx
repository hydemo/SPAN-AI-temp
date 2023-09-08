import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { downloadTemplate } from '@/services/apiList/userManagement';

export const DownloadTemplate = () => {
  const handleDownload = () => {
    downloadTemplate();
  };
  return (
    <Button onClick={handleDownload} icon={<DownloadOutlined />}>
      模板
    </Button>
  );
};
