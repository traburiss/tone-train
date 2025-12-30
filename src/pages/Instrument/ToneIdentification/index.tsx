import { PageContainer } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React, { useState } from 'react';
import Practice from './Practice';
import Statistics from './Statistics';

const ToneIdentificationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('practice');
  const intl = useIntl();

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'menu.instrument.tone-identification' }),
      }}
      tabList={[
        {
          tab: intl.formatMessage({ id: 'tone-identification.practice' }),
          key: 'practice',
        },
        {
          tab: intl.formatMessage({ id: 'tone-identification.statistics' }),
          key: 'statistics',
        },
      ]}
      tabActiveKey={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'practice' && <Practice />}
      {activeTab === 'statistics' && <Statistics />}
    </PageContainer>
  );
};


export default ToneIdentificationPage;
