import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '音乐助教',
    layout: 'top',
    siderWidth: 0,
  },
  favicons: ['logo.svg'],
  routes: [
    {
      name: '首页',
      path: '/',
      component: './Home',
    },
    {
      name: '器乐训练',
      routes: [
        {
          name: '听音训练',
          path: '/instrument/tone-training',
          component: './Instrument/ToneTraining',
        },
        {
          name: '听音判断',
          path: '/instrument/tone-identification',
          component: './Instrument/ToneIdentification',
        },
      ],
    },
    {
      name: '系统设置',
      path: '/settings',
      icon: 'setting',
      component: './Settings',
    },
  ],
  npmClient: 'pnpm',
  esbuildMinifyIIFE: true,
  tailwindcss: {},
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  history: { type: 'hash' },
});
