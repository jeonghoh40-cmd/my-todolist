import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTodos } from '../hooks/useTodos';
import { Todo } from '../domain/entities/Todo';
import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import LanguageSelector from '../components/LanguageSelector';

const TodoList: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { translations } = useLanguage();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);

  const {
    todos,
    isLoading,
    error,
    addTodo,
    updateTodo,
    removeTodo,
    toggleCompletion
  } = useTodos();

  const handleAddTodo = async (data: { title: string; description?: string; due_date?: string }) => {
    try {
      await addTodo(data.title, data.description, data.due_date ? new Date(data.due_date) : undefined);
      setShowAddModal(false);
    } catch (err) {
      alert(error || translations.todoAddError || '할일 추가에 실패했습니다');
    }
  };

  const handleUpdateTodo = async (data: { title: string; description?: string; due_date?: string }) => {
    if (!editingTodo) return;

    try {
      await updateTodo(editingTodo.id, data.title, data.description, data.due_date ? new Date(data.due_date) : undefined);
      setEditingTodo(null);
    } catch (err) {
      alert(error || translations.todoUpdateError);
    }
  };

  const handleDeleteTodo = async () => {
    if (!deletingTodo) return;

    try {
      await removeTodo(deletingTodo.id);
      setDeletingTodo(null);
    } catch (err) {
      alert(error || translations.todoDeleteError);
    }
  };

  const handleToggleTodo = async (todoId: number, isCompleted: boolean) => {
    try {
      await toggleCompletion(todoId);
    } catch (err) {
      alert(error || translations.todoToggleError);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-gray)' }}>
      <header style={{
        backgroundColor: 'var(--bg-white)',
        borderBottom: '1px solid var(--border-light)',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '500',
            color: 'var(--text-primary)',
            margin: 0,
          }}>
            {translations.myTodos}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {user?.username}{translations.hello}
            </span>
            <LanguageSelector />
            <button
              onClick={toggleTheme}
              style={{
                padding: '8px 12px',
                backgroundColor: 'var(--bg-white)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-light)',
                borderRadius: '4px',
                fontSize: '20px',
                cursor: 'pointer',
              }}
              title={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--bg-white)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-light)',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              {translations.logout}
            </button>
          </div>
        </div>
      </header>

      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '24px',
      }}>
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

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: 'var(--primary-blue)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '20px' }}>+</span>
          {translations.addTodo}
        </button>

        {isLoading ? (
          <LoadingSpinner />
        ) : todos.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--text-secondary)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>{translations.noTodos}</p>
            <p style={{ fontSize: '14px' }}>{translations.addNewTodo}</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px',
          }}>
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onEdit={setEditingTodo}
                onDelete={setDeletingTodo}
              />
            ))}
          </div>
        )}
      </main>

      {showAddModal && (
        <TodoForm
          onSubmit={handleAddTodo}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {editingTodo && (
        <TodoForm
          initialData={editingTodo}
          onSubmit={handleUpdateTodo}
          onCancel={() => setEditingTodo(null)}
        />
      )}

      <ConfirmDialog
        isOpen={!!deletingTodo}
        todo={deletingTodo}
        onConfirm={handleDeleteTodo}
        onCancel={() => setDeletingTodo(null)}
      />
    </div>
  );
};

export default TodoList;
