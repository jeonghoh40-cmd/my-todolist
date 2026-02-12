import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, isCompleted: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onEdit, onDelete }) => {
  const isCompleted = todo.is_completed;
  const { translations } = useLanguage();

  return (
    <div style={{
      backgroundColor: isCompleted ? 'var(--bg-gray)' : 'var(--surface)',
      border: '1px solid var(--border-light)',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      opacity: isCompleted ? 0.8 : 1,
      transition: 'all 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => onToggle(todo.id, !isCompleted)}
          style={{
            width: '24px',
            height: '24px',
            marginRight: '12px',
            cursor: 'pointer',
            accentColor: 'var(--primary-blue)',
          }}
        />
        <h3 style={{
          fontSize: '14px',
          fontWeight: '500',
          color: 'var(--text-primary)',
          margin: 0,
          flex: 1,
          textDecoration: isCompleted ? 'line-through' : 'none',
          wordBreak: 'break-word',
        }}>
          {todo.title}
        </h3>
      </div>

      {todo.description && (
        <p style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          marginBottom: '12px',
          marginLeft: '36px',
          lineHeight: '1.5',
          wordBreak: 'break-word',
        }}>
          {todo.description}
        </p>
      )}

      {todo.due_date && (
        <p style={{
          fontSize: '11px',
          color: 'var(--text-secondary)',
          marginBottom: '12px',
          marginLeft: '36px',
        }}>
          {translations.dueDate}: {new Date(todo.due_date).toLocaleDateString('ko-KR')}
        </p>
      )}

      <div style={{
        display: 'flex',
        gap: '8px',
        marginLeft: '36px',
      }}>
        <button
          onClick={() => onEdit(todo)}
          style={{
            padding: '6px 12px',
            backgroundColor: 'var(--bg-white)',
            color: 'var(--primary-blue)',
            border: '1px solid var(--primary-blue)',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          {translations.edit}
        </button>
        <button
          onClick={() => onDelete(todo)}
          style={{
            padding: '6px 12px',
            backgroundColor: 'var(--bg-white)',
            color: 'var(--danger-red)',
            border: '1px solid var(--danger-red)',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          {translations.delete}
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
