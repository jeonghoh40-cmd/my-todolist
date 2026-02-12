import React, { useEffect } from 'react';
import type { Todo } from '../types/todo';

interface ConfirmDialogProps {
  isOpen: boolean;
  todo: Todo | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, todo, onConfirm, onCancel }) => {
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
        backgroundColor: 'rgba(0,0,0,0.5)',
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
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        padding: '24px',
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '500',
          color: '#202124',
          marginBottom: '16px',
          textAlign: 'center',
        }}>
          정말 삭제하시겠습니까?
        </h2>

        <p style={{
          fontSize: '16px',
          color: '#202124',
          marginBottom: '8px',
          textAlign: 'center',
          fontWeight: '500',
        }}>
          "{todo.title}"
        </p>

        <p style={{
          fontSize: '14px',
          color: '#5f6368',
          marginBottom: '24px',
          textAlign: 'center',
        }}>
          이 작업은 취소할 수 없습니다.
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
              backgroundColor: '#ffffff',
              color: '#5f6368',
              border: '1px solid #dadce0',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '12px 24px',
              backgroundColor: '#d93025',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
