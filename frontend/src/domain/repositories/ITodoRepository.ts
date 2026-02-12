import { Todo } from '../entities/Todo';

export interface ITodoRepository {
  getTodos(token: string): Promise<Todo[]>;
  createTodo(token: string, todo: Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Todo>;
  updateTodo(token: string, todoId: number, todo: Partial<Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<Todo>;
  deleteTodo(token: string, todoId: number): Promise<boolean>;
  toggleComplete(token: string, todoId: number, isCompleted: boolean): Promise<Todo>;
}