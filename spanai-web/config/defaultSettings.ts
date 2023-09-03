import { Settings as LayoutSettings } from '@ant-design/pro-components';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  headerTheme: 'light',
  // 拂晓蓝
  primaryColor: '#4e3abc',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: ' ',
  pwa: false,
  logo: 'http://qn.greatwebtech.cn/home/span-logo.png',
  iconfontUrl: '',
  headerHeight: 72,
};

export default Settings;
