import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'tone-train',
    menuRender: false,
  },
  routes: [
    {
      name: '欢迎使用音阶训练',
      path: '/',
      component: './Home',
    },
  ],
  npmClient: 'pnpm',
});
