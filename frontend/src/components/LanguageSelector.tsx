import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = e.target.value as 'ko' | 'en';
    setLanguage(selectedLanguage);
  };

  return (
    <select
      value={language}
      onChange={handleLanguageChange}
      style={{
        padding: '8px 12px',
        backgroundColor: 'var(--bg-white)',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-light)',
        borderRadius: '4px',
        fontSize: '14px',
        cursor: 'pointer',
      }}
    >
      <option value="ko">한국어</option>
      <option value="en">English</option>
    </select>
  );
};

export default LanguageSelector;