import { useState, useEffect } from 'react';
import { 
  getTodosUseCase, 
  createTodoUseCase, 
  updateTodoUseCase, 
  deleteTodoUseCase, 
  toggleTodoCompletionUseCase 
} from '../composition-root';
import { Todo } from '../domain/entities/Todo';
import { useAuth } from '../contexts/AuthContext';

interface UseTodosReturn {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  loadTodos: () => Promise<void>;
  addTodo: (title: string, description?: string, dueDate?: Date) => Promise<void>;
  updateTodo: (id: number, title: string, description?: string, dueDate?: Date) => Promise<void>;
  removeTodo: (id: number) => Promise<void>;
  toggleCompletion: (id: number) => Promise<void>;
}

export const useTodos = (): UseTodosReturn => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  if (!token) {
    throw new Error('Authentication token is required to use todos');
  }

  const loadTodos = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = useAuth().user?.id || 0; // Get user ID from context
      const loadedTodos = await getTodosUseCase.execute(token, userId);
      setTodos(loadedTodos);
    } catch (err) {
      setError(err instanceof Error ? err.message : '할일 목록을 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async (title: string, description?: string, dueDate?: Date): Promise<void> => {
    if (!token) return;
    
    const userId = useAuth().user?.id || 0; // Get user ID from context
    try {
      const newTodo = await createTodoUseCase.execute(token, userId, { title, description, dueDate });
      setTodos(prev => [newTodo, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '할일 추가에 실패했습니다');
      throw err;
    }
  };

  const updateTodo = async (id: number, title: string, description?: string, dueDate?: Date): Promise<void> => {
    if (!token) return;
    
    const userId = useAuth().user?.id || 0; // Get user ID from context
    try {
      const updatedTodo = await updateTodoUseCase.execute(token, userId, id, { title, description, dueDate });
      setTodos(prev => prev.map(todo => todo.id === id ? updatedTodo : todo));
    } catch (err) {
      setError(err instanceof Error ? err.message : '할일 수정에 실패했습니다');
      throw err;
    }
  };

  const removeTodo = async (id: number): Promise<void> => {
    if (!token) return;
    
    const userId = useAuth().user?.id || 0; // Get user ID from context
    try {
      const success = await deleteTodoUseCase.execute(token, userId, id);
      if (success) {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '할일 삭제에 실패했습니다');
      throw err;
    }
  };

  const toggleCompletion = async (id: number): Promise<void> => {
    if (!token) return;
    
    const userId = useAuth().user?.id || 0; // Get user ID from context
    try {
      const updatedTodo = await toggleTodoCompletionUseCase.execute(token, userId, id);
      setTodos(prev => prev.map(todo => todo.id === id ? updatedTodo : todo));
    } catch (err) {
      setError(err instanceof Error ? err.message : '할일 완료 상태 변경에 실패했습니다');
      throw err;
    }
  };

  // Load todos when token changes
  useEffect(() => {
    if (token) {
      loadTodos();
    }
  }, [token]);

  return {
    todos,
    isLoading,
    error,
    loadTodos,
    addTodo,
    updateTodo,
    removeTodo,
    toggleCompletion
  };
};