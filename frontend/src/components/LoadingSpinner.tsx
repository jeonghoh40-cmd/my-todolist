import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LoadingSpinner: React.FC = () => {
  const { translations } = useLanguage();
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        border: '3px solid var(--primary-blue-light)',
        borderTop: '3px solid var(--primary-blue)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <p style={{
        marginTop: '16px',
        fontSize: '14px',
        color: 'var(--text-secondary)',
      }}>
        {translations.loading}
      </p>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
