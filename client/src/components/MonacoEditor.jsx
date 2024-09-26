import React from 'react';
import Editor from "@monaco-editor/react";

const MonacoEditor = ({ value, onChange, language }) => {
  const handleEditorChange = (value) => {
    onChange(value);
  };

  return (
    <Editor
      height="50vh"
      defaultLanguage={language || "javascript"}
      defaultValue={value}
      onChange={handleEditorChange}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: "on",
        automaticLayout: true,
        scrollBeyondLastLine: false,
        padding: { top: 10, bottom: 10 },
      }}
    />
  );
};

export default MonacoEditor;