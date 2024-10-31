// FileContext.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface FileContextType {
  bpmnFileContent: string | null;
  csvFileContent: string | null;
  setBpmnFileContent: (content: string | null) => void;
  setCsvFileContent: (content: string | null) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [bpmnFileContent, setBpmnFileContent] = useState<string | null>(null);
  const [csvFileContent, setCsvFileContent] = useState<string | null>(null);

  return (
    <FileContext.Provider value={{ bpmnFileContent, csvFileContent, setBpmnFileContent, setCsvFileContent }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = (): FileContextType => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFileContext must be used within a FileProvider');
  }
  return context;
};
