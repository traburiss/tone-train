import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '听音训练',
    layout: 'top',
    menuRender: false,
    siderWidth: 0,
  },
  favicons: ['logo.png'],
  routes: [
    {
      name: '欢迎使用音阶训练',
      path: '/',
      component: './Home',
    },
  ],

  npmClient: 'pnpm',
  esbuildMinifyIIFE: true,
  tailwindcss: {},
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  history: { type: 'hash' },
});
