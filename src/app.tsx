import GlobalInstrumentLoader from '@/components/GlobalInstrumentLoader';
import { getIntl, SelectLang } from '@umijs/max';

export const layout = () => {
  return {
    logo: 'logo.svg',
    title: getIntl().formatMessage({ id: 'app.name' }),
    menu: {
      locale: true,
    },
    layout: 'top',
    rightContentRender: () => (
      <>
        <GlobalInstrumentLoader />
        <SelectLang />
      </>
    ),
  };
};
