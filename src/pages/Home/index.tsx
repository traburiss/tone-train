import { SoundOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <PageContainer title="欢迎使用音乐助教">
      <ProCard
        ghost
        gutter={[16, 16]}
        wrap
        title="核心功能"
        style={{ marginBlockStart: 24 }}
      >
        <ProCard
          colSpan={{ xs: 24, sm: 12, md: 8 }}
          layout="center"
          bordered
          hoverable
          onClick={() => {
            history.push('/instrument/tone-training');
          }}
          title={
            <div className="flex items-center gap-2">
              <SoundOutlined className="text-blue-500" />
              <span>听音训练</span>
            </div>
          }
        >
          <div className="text-gray-500 text-center py-4">
            <div>磨耳朵，提升听感</div>
            <div className="mt-2 text-xs">支持和弦、单音等多种训练模式</div>
          </div>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default HomePage;
