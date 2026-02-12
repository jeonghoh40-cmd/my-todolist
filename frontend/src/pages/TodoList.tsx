import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { todoAPI, ApiError } from '../api/api';
import type { Todo } from '../types/todo';
import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';

const TodoList: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);

  const loadTodos = useCallback(async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await todoAPI.getTodos(token);
      setTodos(data.todos || []);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === 'E-101') {
          logout();
          navigate('/login');
        } else {
          setError(err.message);
        }
      } else {
        setError('할일 목록을 불러오는 데 실패했습니다');
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, navigate, logout]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleAddTodo = async (data: { title: string; description?: string; due_date?: string }) => {
    if (!token) return;

    try {
      const newTodo = await todoAPI.createTodo(token, data);
      setTodos((prev) => [newTodo.todo, ...prev]);
      setShowAddModal(false);
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      } else {
        alert('할일 추가에 실패했습니다');
      }
    }
  };

  const handleUpdateTodo = async (data: { title: string; description?: string; due_date?: string }) => {
    if (!token || !editingTodo) return;

    try {
      const updatedTodo = await todoAPI.updateTodo(token, editingTodo.id, data);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === editingTodo.id ? updatedTodo.todo : todo))
      );
      setEditingTodo(null);
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      } else {
        alert('할일 수정에 실패했습니다');
      }
    }
  };

  const handleDeleteTodo = async () => {
    if (!token || !deletingTodo) return;

    try {
      await todoAPI.deleteTodo(token, deletingTodo.id);
      setTodos((prev) => prev.filter((todo) => todo.id !== deletingTodo.id));
      setDeletingTodo(null);
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      } else {
        alert('할일 삭제에 실패했습니다');
      }
    }
  };

  const handleToggleTodo = async (todoId: number, isCompleted: boolean) => {
    if (!token) return;

    try {
      const updatedTodo = await todoAPI.toggleComplete(token, todoId, isCompleted);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === todoId ? updatedTodo.todo : todo))
      );
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      } else {
        alert('할일 상태 변경에 실패했습니다');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f3f4' }}>
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #dadce0',
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
            color: '#202124',
            margin: 0,
          }}>
            나의 할일 목록
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', color: '#5f6368' }}>
              {user?.username}님
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ffffff',
                color: '#5f6368',
                border: '1px solid #dadce0',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              로그아웃
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
            backgroundColor: '#fce8e6',
            color: '#d93025',
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
            backgroundColor: '#1a73e8',
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
          할일 추가
        </button>

        {isLoading ? (
          <LoadingSpinner />
        ) : todos.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#5f6368',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>할일이 없습니다.</p>
            <p style={{ fontSize: '14px' }}>새로운 할일을 추가해보세요!</p>
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
