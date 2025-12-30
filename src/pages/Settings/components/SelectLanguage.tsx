import { TranslationOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Dropdown } from 'antd';

interface SelectLanguageProps {
  icon?: React.ReactNode;
}

// TODO
export const SelectLanguage: React.FC<SelectLanguageProps> = ({ icon }) => {
  const intl = useIntl();
  return (
    <Dropdown className="select-language">
      <span className="icon">
        <i
          className="anticon"
          title={intl.formatMessage({ id: 'settings.language.change' })}
        >
          {icon ?? <TranslationOutlined />}
        </i>
      </span>
    </Dropdown>
  );
};
