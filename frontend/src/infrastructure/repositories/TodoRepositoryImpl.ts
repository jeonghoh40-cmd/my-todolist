import { Todo } from '../../domain/entities/Todo';
import { todoAPI } from '../../api/api';

// Define the interface type for reference but don't implement it directly to avoid runtime issues
interface ITodoRepository {
  getTodos(token: string): Promise<Todo[]>;
  createTodo(token: string, todo: Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Todo>;
  updateTodo(token: string, todoId: number, todo: Partial<Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<Todo>;
  deleteTodo(token: string, todoId: number): Promise<boolean>;
  toggleComplete(token: string, todoId: number, isCompleted: boolean): Promise<Todo>;
}

export class TodoRepositoryImpl {
  getTodos: (token: string) => Promise<Todo[]> = async (token: string): Promise<Todo[]> => {
    const response = await todoAPI.getTodos(token);
    return response.map(dto => {
      // Convert string dates to Date objects
      return new Todo(
        dto.id,
        dto.user_id,
        dto.title,
        dto.description,
        dto.due_date ? new Date(dto.due_date) : undefined,
        dto.is_completed,
        new Date(dto.created_at),
        new Date(dto.updated_at)
      );
    });
  }

  createTodo: (token: string, todo: Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<Todo> = 
    async (token: string, todo: Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Todo> => {
      const requestData = {
        title: todo.title,
        description: todo.description,
        due_date: todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : undefined
      };

      const response = await todoAPI.createTodo(token, requestData);

      return new Todo(
        response.id,
        response.user_id,
        response.title,
        response.description,
        response.due_date ? new Date(response.due_date) : undefined,
        response.is_completed,
        new Date(response.created_at),
        new Date(response.updated_at)
      );
    }

  updateTodo: (token: string, todoId: number, todo: Partial<Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) => Promise<Todo> =
    async (token: string, todoId: number, todo: Partial<Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<Todo> => {
      const requestData = {
        title: todo.title || undefined,
        description: todo.description || undefined,
        due_date: todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : undefined
      };

      const response = await todoAPI.updateTodo(token, todoId, requestData);

      return new Todo(
        response.id,
        response.user_id,
        response.title,
        response.description,
        response.due_date ? new Date(response.due_date) : undefined,
        response.is_completed,
        new Date(response.created_at),
        new Date(response.updated_at)
      );
    }

  deleteTodo: (token: string, todoId: number) => Promise<boolean> =
    async (token: string, todoId: number): Promise<boolean> => {
      await todoAPI.deleteTodo(token, todoId);
      return true; // If no error was thrown, assume deletion was successful
    }

  toggleComplete: (token: string, todoId: number, isCompleted: boolean) => Promise<Todo> =
    async (token: string, todoId: number, isCompleted: boolean): Promise<Todo> => {
      const response = await todoAPI.toggleComplete(token, todoId, isCompleted);

      return new Todo(
        response.id,
        response.user_id,
        response.title,
        response.description,
        response.due_date ? new Date(response.due_date) : undefined,
        response.is_completed,
        new Date(response.created_at),
        new Date(response.updated_at)
      );
    }
}