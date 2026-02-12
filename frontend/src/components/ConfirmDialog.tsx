import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Todo } from '../domain/entities/Todo';

interface ConfirmDialogProps {
  isOpen: boolean;
  todo: Todo | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, todo, onConfirm, onCancel }) => {
  const { translations } = useLanguage();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onCancel]);

  if (!isOpen || !todo) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'var(--overlay-dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: '360px',
        backgroundColor: 'var(--surface)',
        borderRadius: '8px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        padding: '24px',
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '500',
          color: 'var(--text-primary)',
          marginBottom: '16px',
          textAlign: 'center',
        }}>
          {translations.deleteConfirmation}
        </h2>

        <p style={{
          fontSize: '16px',
          color: 'var(--text-primary)',
          marginBottom: '8px',
          textAlign: 'center',
          fontWeight: '500',
        }}>
          "{todo.title}"
        </p>

        <p style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          marginBottom: '24px',
          textAlign: 'center',
        }}>
          {translations.cannotUndo}
        </p>

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '12px 24px',
              backgroundColor: 'var(--bg-white)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-light)',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            {translations.cancel}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '12px 24px',
              backgroundColor: 'var(--danger-red)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            {translations.delete}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
