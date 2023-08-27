import { defineConfig } from '@umijs/max';
import routes from './config/routes';
import defaultSettings from './config/defaultSettings';

const qiniuBase = process.env.MODE === 'dev' ? 'cms_dev' : 'cms';

export default defineConfig({
  outputPath: 'cms/',
  base: '/cms/',
  publicPath: '/cms/',
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  routes,
  npmClient: 'yarn',
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: false,
  },
  manifest: {
    basePath: '/cms/'
  },
  clickToComponent: {},
  mfsu: false,
  theme: {
    'root-entry-name': 'variable',
    'primary-color': '#4e3abc',
    'blue-base': '#4e3abc'
  },
  monorepoRedirect: {},
  devtool: 'source-map',
  hash: true,
});
