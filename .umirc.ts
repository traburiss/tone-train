import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    layout: 'top',
    siderWidth: 0,
  },
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true,
    title: true,
    useLocalStorage: true,
  },
  favicons: ['logo.svg'],
  routes: [
    {
      title: 'menu.home',
      path: '/',
      component: './Home',
      icon: 'HomeOutlined',
    },
    {
      title: 'menu.instrument',
      icon: 'CustomerServiceOutlined',
      routes: [
        {
          title: 'menu.instrument.tone-training',
          path: '/instrument/tone-training',
          component: './Instrument/ToneTraining',
          icon: 'SoundOutlined',
        },
        {
          title: 'menu.instrument.tone-identification',
          path: '/instrument/tone-identification',
          component: './Instrument/ToneIdentification',
          icon: 'CustomerServiceOutlined',
        },
      ],
    },
    {
      title: 'menu.settings',
      path: '/settings',
      icon: 'SettingOutlined',
      component: './Settings',
    },
  ],
  npmClient: 'pnpm',
  esbuildMinifyIIFE: true,
  tailwindcss: {},
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  history: { type: 'hash' },
});
