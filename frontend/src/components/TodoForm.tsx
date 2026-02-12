import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Todo } from '../types/todo';

interface TodoFormProps {
  initialData?: Todo | null;
  onSubmit: (data: { title: string; description?: string; due_date?: string }) => void;
  onCancel: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { translations } = useLanguage();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
  });
  const [error, setError] = useState('');

  // initialData가 변경될 때 폼 데이터 초기화
  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        due_date: initialData.due_date || '',
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError(translations.titleRequired);
      return;
    }

    onSubmit({
      title: formData.title,
      description: formData.description || undefined,
      due_date: formData.due_date || undefined,
    });
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onCancel]);

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
        maxWidth: '500px',
        backgroundColor: 'var(--surface)',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        overflow: 'hidden',
      }}>
        <div style={{
          backgroundColor: 'var(--primary-blue)',
          color: '#ffffff',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '500', margin: 0 }}>
            {initialData ? translations.edit + ' ' + translations.todo : translations.addTodo}
          </h2>
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: 'var(--danger-red-light)',
              color: 'var(--danger-red)',
              borderRadius: '4px',
              marginBottom: '16px',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: 'var(--text-primary)',
              marginBottom: '6px',
              fontWeight: '500',
            }}>
              {translations.title} <span style={{ color: 'var(--danger-red)' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, title: e.target.value }));
                setError('');
              }}
              style={{
                width: '100%',
                height: '48px',
                padding: '0 12px',
                border: '1px solid var(--border-light)',
                borderRadius: '4px',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: 'var(--bg-white)',
                color: 'var(--text-primary)',
              }}
              autoFocus
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: 'var(--text-primary)',
              marginBottom: '6px',
              fontWeight: '500',
            }}>
              {translations.descriptionLabel}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '12px',
                border: '1px solid var(--border-light)',
                borderRadius: '4px',
                fontSize: '16px',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                backgroundColor: 'var(--bg-white)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: 'var(--text-primary)',
              marginBottom: '6px',
              fontWeight: '500',
            }}>
              {translations.dueDate}
            </label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData((prev) => ({ ...prev, due_date: e.target.value }))}
              style={{
                width: '100%',
                height: '48px',
                padding: '0 12px',
                border: '1px solid var(--border-light)',
                borderRadius: '4px',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: 'var(--bg-white)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
          }}>
            <button
              type="button"
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
              type="submit"
              style={{
                padding: '12px 24px',
                backgroundColor: 'var(--primary-blue)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              {translations.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;
