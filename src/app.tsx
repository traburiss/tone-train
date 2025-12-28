import GlobalInstrumentLoader from '@/components/GlobalInstrumentLoader';

export const layout = () => {
  return {
    logo: 'logo.svg',
    title: '音乐助教',
    menu: {
      locale: false,
    },
    layout: 'top',
    rightContentRender: () => <GlobalInstrumentLoader />,
  };
};
