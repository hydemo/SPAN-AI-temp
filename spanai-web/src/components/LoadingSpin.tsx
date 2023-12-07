import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const antIcon = <LoadingOutlined style={{ fontSize: 18 }} spin />;

export const LoadingSpin = () => {
  return <Spin indicator={antIcon} />;
};
