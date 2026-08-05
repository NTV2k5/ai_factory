import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'vi';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    workspace: 'Workspace',
    agentConfig: 'Agent Config',
    pipeline: 'Task Pipeline',
    knowledgeGraph: 'Knowledge Graph',
    humanReview: 'Human Review',
    settings: 'Settings',
  },
  vi: {
    dashboard: 'Bảng điều khiển',
    workspace: 'Không gian làm việc',
    agentConfig: 'Cấu hình Agent',
    pipeline: 'Quy trình xử lý',
    knowledgeGraph: 'Đồ thị tri thức',
    humanReview: 'Duyệt yêu cầu',
    settings: 'Cài đặt',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('vi');

  const t = (key: string) => translations[lang]?.[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
