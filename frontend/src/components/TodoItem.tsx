import React from 'react';
import type { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, isCompleted: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onEdit, onDelete }) => {
  const isCompleted = todo.is_completed;

  return (
    <div style={{
      backgroundColor: isCompleted ? '#f8f9fa' : '#ffffff',
      border: '1px solid #dadce0',
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
            accentColor: '#1a73e8',
          }}
        />
        <h3 style={{
          fontSize: '18px',
          fontWeight: '500',
          color: '#202124',
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
          fontSize: '14px',
          color: '#5f6368',
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
          fontSize: '13px',
          color: '#5f6368',
          marginBottom: '12px',
          marginLeft: '36px',
        }}>
          마감일: {new Date(todo.due_date).toLocaleDateString('ko-KR')}
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
            padding: '8px 16px',
            backgroundColor: '#ffffff',
            color: '#1a73e8',
            border: '1px solid #1a73e8',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          수정
        </button>
        <button
          onClick={() => onDelete(todo)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ffffff',
            color: '#d93025',
            border: '1px solid #d93025',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
