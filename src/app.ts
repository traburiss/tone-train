
export const layout = () => {
  return {
    logo: 'logo.svg',
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
