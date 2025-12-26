// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const layout = () => {
  return {
    logo: 'logo.png',
    title: '听音训练',
    menu: {
      locale: false,
    },
    layout: 'top',
    menuRender: false,
    rightContentRender: false, // 移除右上角用户登录信息
    actionsRender: false, // 移除其他操作图标
  };
};
