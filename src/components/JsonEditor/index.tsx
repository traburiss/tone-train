import Editor, { OnChange } from '@monaco-editor/react';
import React from 'react';

interface JsonEditorProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  height?: string | number;
  language?: string;
  readonly?: boolean;
}

const JsonEditor: React.FC<JsonEditorProps> = ({
  value,
  onChange,
  height = '300px',
  language = 'json',
  readonly = false,
}) => {
  const handleEditorChange: OnChange = (val) => {
    if (onChange) {
      onChange(val);
    }
  };

  return (
    <div
      style={{
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        overflow: 'auto',
        resize: 'vertical',
        height: height,
      }}
    >
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          readOnly: readonly,
          tabSize: 2,
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
};

export default JsonEditor;
