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
import { useIntl } from '@umijs/max';
import { Button, Col, message, Modal, Row, Space, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import ConfigItemEditor from './components/ConfigItemEditor';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({});
  const intl = useIntl();

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
    message.success(
      key === null
        ? intl.formatMessage({ id: 'settings.export.all.success' })
        : intl.formatMessage({ id: 'settings.export.config.success' }, { key }),
    );
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
    message.success(
      key === null
        ? intl.formatMessage(
            { id: 'settings.export.config.success' },
            { key: 'all' },
          )
        : intl.formatMessage({ id: 'settings.export.config.success' }, { key }),
    );
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
      key === null
        ? intl.formatMessage({ id: 'settings.export.stats.success' })
        : intl.formatMessage(
            { id: 'settings.export.stats-item.success' },
            { key },
          ),
    );
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        importAllSettings(json);
        message.success(intl.formatMessage({ id: 'settings.import.success' }));
        refreshData();
      } catch (err) {
        message.error(intl.formatMessage({ id: 'settings.import.error' }));
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
      okText: intl.formatMessage({ id: 'settings.clear.confirm-ok' }),
      okType: 'danger',
      onOk,
    });
  };

  const handleClearAll = (key: string | null = null) => {
    clearWithConfirm(
      key === null
        ? intl.formatMessage({ id: 'settings.clear.all-confirm-title' })
        : intl.formatMessage(
            { id: 'settings.clear.item-confirm-title' },
            { key },
          ),
      key === null
        ? intl.formatMessage({ id: 'settings.clear.all-confirm-content' })
        : intl.formatMessage(
            { id: 'settings.clear.item-confirm-content' },
            { key },
          ),
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
            ? intl.formatMessage({ id: 'settings.clear.all.success' })
            : intl.formatMessage(
                { id: 'settings.clear.item.success' },
                { key },
              ),
        );
        refreshData();
      },
    );
  };

  const handleClearConfig = (key: string | null = null) => {
    clearWithConfirm(
      key === null
        ? intl.formatMessage({ id: 'settings.clear.all-config-confirm-title' })
        : intl.formatMessage(
            { id: 'settings.clear.item-config-confirm-title' },
            { key },
          ),
      key === null
        ? intl.formatMessage({
            id: 'settings.clear.all-config-confirm-content',
          })
        : intl.formatMessage(
            { id: 'settings.clear.item-config-confirm-content' },
            { key },
          ),
      () => {
        if (key === null) {
          clearAllSettings();
        } else {
          clearPageSettings(key);
        }
        message.success(
          key === null
            ? intl.formatMessage({ id: 'settings.clear.config.success' })
            : intl.formatMessage(
                { id: 'settings.clear.config-item.success' },
                { key },
              ),
        );
        refreshData();
      },
    );
  };

  const handleClearStats = (key: string | null = null) => {
    clearWithConfirm(
      key === null
        ? intl.formatMessage({ id: 'settings.clear.all-stats-confirm-title' })
        : intl.formatMessage(
            { id: 'settings.clear.item-stats-confirm-title' },
            { key },
          ),
      key === null
        ? intl.formatMessage({ id: 'settings.clear.all-stats-confirm-content' })
        : intl.formatMessage(
            { id: 'settings.clear.item-stats-confirm-content' },
            { key },
          ),
      () => {
        if (key === null) {
          clearAllStats();
        } else {
          clearPageStats(key);
        }
        message.success(
          key === null
            ? intl.formatMessage({ id: 'settings.clear.stats.success' })
            : intl.formatMessage(
                { id: 'settings.clear.stats-item.success' },
                { key },
              ),
        );
        refreshData();
      },
    );
  };

  return (
    <PageContainer title={intl.formatMessage({ id: 'settings.title' })}>
      <ProCard
        title={intl.formatMessage({ id: 'settings.global-actions' })}
        gutter={[16, 16]}
        wrap
        ghost
      >
        <ProCard
          title={
            <>
              <DownloadOutlined />{' '}
              {intl.formatMessage({ id: 'settings.export.title' })}
            </>
          }
          colSpan={{ xs: 24, md: 8 }}
          bordered
          hoverable
        >
          <Space size="middle" align="start" wrap>
            <Button
              icon={<DatabaseOutlined />}
              onClick={() => handleExportAll(null)}
            >
              {intl.formatMessage({ id: 'settings.export.all' })}
            </Button>
            <Button
              icon={<CodeOutlined />}
              onClick={() => handleExportConfig(null)}
            >
              {intl.formatMessage({ id: 'settings.export.config' })}
            </Button>
            <Button
              icon={<BarChartOutlined />}
              onClick={() => handleExportStats(null)}
            >
              {intl.formatMessage({ id: 'settings.export.stats' })}
            </Button>
          </Space>
        </ProCard>
        <ProCard
          title={
            <>
              <UploadOutlined />{' '}
              {intl.formatMessage({ id: 'settings.import.title' })}
            </>
          }
          colSpan={{ xs: 24, md: 8 }}
          bordered
          hoverable
        >
          <Upload
            beforeUpload={handleImport}
            showUploadList={false}
            accept=".json"
          >
            <Button icon={<UploadOutlined />} type="primary">
              {intl.formatMessage({ id: 'settings.import.button' })}
            </Button>
          </Upload>
        </ProCard>
        <ProCard
          title={
            <>
              <DeleteOutlined />{' '}
              {intl.formatMessage({ id: 'settings.clear.title' })}
            </>
          }
          colSpan={{ xs: 24, md: 8 }}
          bordered
          hoverable
        >
          <Space size="middle" align="start" wrap>
            <Button
              icon={<RestOutlined />}
              danger
              onClick={() => handleClearAll(null)}
            >
              {intl.formatMessage({ id: 'settings.clear.all' })}
            </Button>
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleClearConfig(null)}
            >
              {intl.formatMessage({ id: 'settings.clear.config' })}
            </Button>
            <Button
              icon={<BarChartOutlined />}
              danger
              onClick={() => handleClearStats(null)}
            >
              {intl.formatMessage({ id: 'settings.clear.stats' })}
            </Button>
          </Space>
        </ProCard>
      </ProCard>

      <ProCard
        title={intl.formatMessage({ id: 'settings.item-actions' })}
        gutter={[16, 16]}
        wrap
        ghost
      >
        {CONFIG_kEY_LIST.map(({ key, name }) => {
          const item = settings[key];
          return (
            <ProCard
              title={intl.formatMessage({ id: name })}
              colSpan={{ xs: 24, md: 8 }}
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
                      {intl.formatMessage({ id: 'settings.export.all' })}
                    </Button>
                    <Button
                      icon={<CodeOutlined />}
                      onClick={() => handleExportConfig(key)}
                    >
                      {intl.formatMessage(
                        { id: 'settings.export.config.success' },
                        { key: 'mta:cfg' },
                      )}
                    </Button>
                    <Button
                      icon={<BarChartOutlined />}
                      onClick={() => handleExportStats(key)}
                    >
                      {intl.formatMessage(
                        { id: 'settings.export.stats-item.success' },
                        { key: 'mta:sta' },
                      )}
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
                      {intl.formatMessage({ id: 'settings.clear.all' })}
                    </Button>
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => handleClearConfig(key)}
                    >
                      {intl.formatMessage({ id: 'settings.clear.config' })}
                    </Button>
                    <Button
                      icon={<BarChartOutlined />}
                      danger
                      onClick={() => handleClearStats(key)}
                    >
                      {intl.formatMessage({ id: 'settings.clear.stats' })}
                    </Button>
                  </Space>
                </Col>
                <Col span={24}>
                  <ConfigItemEditor
                    key={key}
                    storageKey={key}
                    name={intl.formatMessage({ id: name })}
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
