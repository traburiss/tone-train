import { PageContainer } from '@ant-design/pro-components';
import React, { useState } from 'react';
import Practice from './Practice';
import Statistics from './Statistics';

const ToneIdentificationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('practice');

  return (
    <PageContainer
      header={{
        title: '听音判断',
      }}
      tabList={[
        {
          tab: '功能练习',
          key: 'practice',
        },
        {
          tab: '统计分析',
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
