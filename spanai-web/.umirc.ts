import { defineConfig } from 'umi';
import routes from './config/routes';

export default defineConfig({
  routes,
  npmClient: 'yarn',
  clickToComponent: {},
  hash: true,
  theme: {
    'root-entry-name': 'variable',
    'primary-color': '#4e3abc',
    'blue-base': '#4e3abc',
  },
});
