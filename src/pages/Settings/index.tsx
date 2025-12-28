import JsonEditor from '@/components/JsonEditor';
import {
  AppSettings,
  clearAllSettings,
  getAllSettings,
  importAllSettings,
  setPageSettings,
} from '@/utils/storage';
import {
  DownloadOutlined,
  RestOutlined,
  SaveOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { PageContainer, ProCard, ProForm } from '@ant-design/pro-components';
import { Button, Empty, message, Modal, Space, Upload } from 'antd';
import React, { useEffect, useState } from 'react';

const ConfigItemEditor: React.FC<{
  storageKey: string;
  name: string;
  initialValue: any;
  onSaved: () => void;
}> = ({ storageKey, name, initialValue, onSaved }) => {
  const [form] = ProForm.useForm();

  useEffect(() => {
    form.setFieldsValue({
      json: JSON.stringify(initialValue, null, 2),
    });
  }, [initialValue]);

  const handleSave = async (values: any) => {
    Modal.confirm({
      title: `确认保存配置吗？`,
      content: `确认保存 ${name} (key: ${storageKey}) 的配置吗？`,
      okText: '确认',
      okType: 'primary',
      onOk: () => {
        try {
          const parsedValue = JSON.parse(values.json);
          // Explicitly preserve the current name while updating value
          setPageSettings(storageKey, parsedValue, name);
          message.success(`${name} 保存成功`);
          onSaved();
        } catch (err) {
          message.error('保存失败：JSON 语法错误');
        }
      },
    });
  };

  return (
    <ProCard
      title={<span className="font-bold text-primary">{name}</span>}
      subTitle={
        <code className="text-xs text-secondary opacity-60 ml-2">
          Key: {storageKey}
        </code>
      }
      className="mb-4 shadow-sm"
      collapsible
      defaultCollapsed
    >
      <ProForm
        form={form}
        onFinish={handleSave}
        submitter={{
          render: (props) => (
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => props.submit()}
            >
              保存本项修改
            </Button>
          ),
        }}
      >
        <ProForm.Item
          name="json"
          label="配置值"
          rules={[{ required: true, message: '请输入配置内容' }]}
        >
          <JsonEditor height="300px" />
        </ProForm.Item>
      </ProForm>
    </ProCard>
  );
};

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({});

  const refreshData = () => {
    setSettings(getAllSettings());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleExport = () => {
    const allSettings = getAllSettings();
    const blob = new Blob([JSON.stringify(allSettings, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mta-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success('导出全量配置成功');
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        importAllSettings(json);
        message.success('导入配置成功');
        refreshData();
      } catch (err) {
        message.error('导入失败：JSON 格式不正确');
      }
    };
    reader.readAsText(file);
    return false;
  };

  const handleReset = () => {
    Modal.confirm({
      title: '确认重置所有配置？',
      content: '该操作将删除所有（带有 mta:cfg 前缀的）本地保存设置。',
      okText: '确认重置',
      okType: 'danger',
      onOk: () => {
        clearAllSettings();
        message.success('所有设置已重置');
        refreshData();
      },
    });
  };

  // Sort settings alphabetically by name
  const sortedKeys = Object.keys(settings).sort((a, b) => {
    const nameA = settings[a].name || '';
    const nameB = settings[b].name || '';
    return nameA.localeCompare(nameB, 'zh-CN');
  });

  return (
    <PageContainer title="系统设置">
      <ProCard title="全局数据操作" className="mb-6">
        <Space size="middle" wrap>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            导出全量 (JSON)
          </Button>
          <Upload
            beforeUpload={handleImport}
            showUploadList={false}
            accept=".json"
          >
            <Button icon={<UploadOutlined />}>导入全量 (JSON)</Button>
          </Upload>
          <Button icon={<RestOutlined />} danger onClick={handleReset}>
            重置全部配置
          </Button>
        </Space>
      </ProCard>
      、
      <ProCard title="配置项" className="mb-6">
        {sortedKeys.length === 0 ? (
          <Empty description="暂无已保存的分项配置" />
        ) : (
          sortedKeys.map((key) => {
            const item = settings[key];
            return (
              <ConfigItemEditor
                key={key}
                storageKey={key}
                name={item.name}
                initialValue={item.value}
                onSaved={refreshData}
              />
            );
          })
        )}
      </ProCard>
    </PageContainer>
  );
};

export default SettingsPage;
