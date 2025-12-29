import JsonEditor from '@/components/JsonEditor';
import { setPageSettings } from '@/utils/storage';
import { SaveOutlined } from '@ant-design/icons';
import { ProCard, ProForm } from '@ant-design/pro-components';
import { Button, message, Modal } from 'antd';
import React, { useEffect } from 'react';

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
export default ConfigItemEditor;
