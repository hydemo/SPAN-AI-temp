import { DownloadOutlined } from '@ant-design/icons';
import { Button, Menu, Dropdown } from 'antd';
import type { ItemType } from 'antd/lib/menu/hooks/useItems';
import type { MenuInfo } from 'rc-menu/lib/interface';

import { download } from '@/services/apiList/conversation';

export type DownloadProps = {
  user: string;
  questionTimeRange: string;
  content: string;
};

export const Download = ({ downloadProps }) => {
  const onMenuClick = (event: MenuInfo) => {
    const { key } = event;
    download(key, downloadProps);
  };

  const menuItems: ItemType[] = [
    {
      key: 'json',
      label: 'json',
    },
    {
      key: 'xlsx',
      label: 'xlsx',
    },
    {
      key: 'csv',
      label: 'csv',
    },
  ];

  const menuHeaderDropdown = (
    <Menu selectedKeys={[]} onClick={onMenuClick} items={menuItems} />
  );

  return (
    <Dropdown overlay={menuHeaderDropdown}>
      <Button icon={<DownloadOutlined />}>下载</Button>
    </Dropdown>
  );
};
