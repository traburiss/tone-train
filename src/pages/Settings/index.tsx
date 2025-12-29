import { CONFIG_kEY_LIST } from '@/constants';
import {
  AppSettings,
  clearAllSettings,
  clearAllStats,
  clearPageSettings,
  clearPageStats,
  getAllSettings,
  getAllStats,
  getPageSettings,
  getStats,
  importAllSettings,
} from '@/utils/storage';
import {
  BarChartOutlined,
  CodeOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  RestOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, Col, message, Modal, Row, Space, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import ConfigItemEditor from './components/ConfigItemEditor';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({});

  const refreshData = () => {
    setSettings(getAllSettings());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleExportAll = (key: string | null = null) => {
    const combined =
      key === null
        ? { settings: getAllSettings(), stats: getAllStats() }
        : { settings: getPageSettings(key, {}), stats: getStats(key, {}) };
    const blob = new Blob([JSON.stringify(combined, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mta-all-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    message.success(key === null ? '导出全量数据成功' : `导出 ${key} 配置成功`);
  };

  const handleExportConfig = (key: string | null = null) => {
    const allSettings =
      key === null ? getAllSettings() : getPageSettings(key, {});
    const blob = new Blob([JSON.stringify(allSettings, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mta-config-only-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    message.success(key === null ? '导出配置数据成功' : `导出 ${key} 配置成功`);
  };

  const handleExportStats = (key: string | null = null) => {
    const allStats = key === null ? getAllStats() : getStats(key, {});
    const blob = new Blob([JSON.stringify(allStats, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mta-stats-only-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    message.success(
      key === null ? '导出统计数据成功' : `导出 ${key} 统计数据成功`,
    );
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        importAllSettings(json);
        message.success('导入数据成功');
        refreshData();
      } catch (err) {
        message.error('导入失败：JSON 格式不正确');
      }
    };
    reader.readAsText(file);
    return false;
  };

  const clearWithConfirm = (
    title: string,
    content: string,
    onOk: () => void,
  ) => {
    Modal.confirm({
      title,
      content,
      okText: '确认清理',
      okType: 'danger',
      onOk,
    });
  };

  const handleClearAll = (key: string | null = null) => {
    clearWithConfirm(
      key === null ? '确认重置所有数据？' : `确认重置 ${key} 数据？`,
      key === null
        ? '该操作将删除所有（带有 mta:cfg 和 mta:sta 前缀的）本地设置和统计背景。'
        : `该操作将删除所有带有 ${key} 前缀的本地设置和统计背景。`,
      () => {
        if (key === null) {
          clearAllSettings();
          clearAllStats();
        } else {
          clearPageSettings(key);
          clearPageStats(key);
        }
        message.success(
          key === null
            ? '所有设置与统计已重置'
            : `所有 ${key} 设置与统计已重置`,
        );
        refreshData();
      },
    );
  };

  const handleClearConfig = (key: string | null = null) => {
    clearWithConfirm(
      key === null ? '确认清空所有配置？' : `确认清空 ${key} 配置？`,
      key === null
        ? '该操作仅删除带有 mta:cfg 前缀的设置，统计数据将保留。'
        : `该操作仅删除带有 ${key} 前缀的设置，统计数据将保留。`,
      () => {
        if (key === null) {
          clearAllSettings();
        } else {
          clearPageSettings(key);
        }
        message.success(
          key === null ? '所有配置已清空' : `所有 ${key} 配置已清空`,
        );
        refreshData();
      },
    );
  };

  const handleClearStats = (key: string | null = null) => {
    clearWithConfirm(
      key === null ? '确认清空所有统计？' : `确认清空 ${key} 统计？`,
      key === null
        ? '该操作仅删除带有 mta:sta 前缀的数据，配置信息将保留。'
        : `该操作仅删除带有 ${key} 前缀的数据，配置信息将保留。`,
      () => {
        if (key === null) {
          clearAllStats();
        } else {
          clearPageStats(key);
        }
        message.success(
          key === null ? '所有统计已清空' : `所有 ${key} 统计已清空`,
        );
        refreshData();
      },
    );
  };

  return (
    <PageContainer title="系统设置项目管理">
      <ProCard title="全局数据操作" gutter={[16, 16]} wrap ghost>
        <ProCard
          title={
            <>
              <DownloadOutlined /> 导出数据
            </>
          }
          colSpan={{ xs: 24, sm: 12, md: 8 }}
          bordered
          hoverable
        >
          <Space size="middle" align="start" wrap>
            <Button
              icon={<DatabaseOutlined />}
              onClick={() => handleExportAll(null)}
            >
              全量导出 (配置+统计)
            </Button>
            <Button
              icon={<CodeOutlined />}
              onClick={() => handleExportConfig(null)}
            >
              仅导出配置 (mta:cfg)
            </Button>
            <Button
              icon={<BarChartOutlined />}
              onClick={() => handleExportStats(null)}
            >
              仅导出统计 (mta:sta)
            </Button>
          </Space>
        </ProCard>
        <ProCard
          title={
            <>
              <UploadOutlined /> 导入数据
            </>
          }
          colSpan={{ xs: 24, sm: 12, md: 8 }}
          bordered
          hoverable
        >
          <Upload
            beforeUpload={handleImport}
            showUploadList={false}
            accept=".json"
          >
            <Button icon={<UploadOutlined />} type="primary">
              开始导入 (JSON)
            </Button>
          </Upload>
        </ProCard>
        <ProCard
          title={
            <>
              <DeleteOutlined /> 清理数据
            </>
          }
          colSpan={{ xs: 24, sm: 12, md: 8 }}
          bordered
          hoverable
        >
          <Space size="middle" align="start" wrap>
            <Button
              icon={<RestOutlined />}
              danger
              onClick={() => handleClearAll(null)}
            >
              清理全量
            </Button>
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleClearConfig(null)}
            >
              清理配置
            </Button>
            <Button
              icon={<BarChartOutlined />}
              danger
              onClick={() => handleClearStats(null)}
            >
              清理统计
            </Button>
          </Space>
        </ProCard>
      </ProCard>

      <ProCard title="功能项操作" gutter={[16, 16]} wrap ghost>
        {CONFIG_kEY_LIST.map(({ key, name }) => {
          const item = settings[key];
          return (
            <ProCard
              title={name}
              colSpan={{ xs: 24, sm: 12, md: 8 }}
              layout="center"
              bordered
              hoverable
              key={`config-cart-${key}`}
            >
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Space size="middle" align="start" wrap>
                    <Button
                      icon={<DatabaseOutlined />}
                      onClick={() => handleExportAll(key)}
                    >
                      全量导出 (配置+统计)
                    </Button>
                    <Button
                      icon={<CodeOutlined />}
                      onClick={() => handleExportConfig(key)}
                    >
                      导出配置 (mta:cfg)
                    </Button>
                    <Button
                      icon={<BarChartOutlined />}
                      onClick={() => handleExportStats(key)}
                    >
                      导出统计 (mta:sta)
                    </Button>
                  </Space>
                </Col>
                <Col span={24}>
                  <Space size="middle" wrap>
                    <Button
                      icon={<RestOutlined />}
                      danger
                      onClick={() => handleClearAll(key)}
                    >
                      清理全量 (配置+统计)
                    </Button>
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => handleClearConfig(key)}
                    >
                      清理配置 (mta:cfg)
                    </Button>
                    <Button
                      icon={<BarChartOutlined />}
                      danger
                      onClick={() => handleClearStats(key)}
                    >
                      清理统计 (mta:sta)
                    </Button>
                  </Space>
                </Col>
                <Col span={24}>
                  <ConfigItemEditor
                    key={key}
                    storageKey={key}
                    name={name}
                    initialValue={item?.value ?? {}}
                    onSaved={refreshData}
                  />
                </Col>
              </Row>
            </ProCard>
          );
        })}
      </ProCard>
    </PageContainer>
  );
};

export default SettingsPage;
