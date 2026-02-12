import { Todo } from '../../domain/entities/Todo';

// Define DTO interfaces locally since they're compile-time constructs
interface CreateTodoDTO {
  title: string;
  description?: string;
  dueDate?: Date;
}

interface UpdateTodoDTO {
  title?: string;
  description?: string;
  dueDate?: Date;
  isCompleted?: boolean;
}

// Define interfaces for type checking
interface ITodoRepository {
  getTodos(token: string): Promise<Todo[]>;
  createTodo(token: string, todo: Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Todo>;
  updateTodo(token: string, todoId: number, todo: Partial<Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<Todo>;
  deleteTodo(token: string, todoId: number): Promise<boolean>;
  toggleComplete(token: string, todoId: number, isCompleted: boolean): Promise<Todo>;
}

export interface IGetTodosUseCase {
  execute(token: string, userId: number): Promise<Todo[]>;
}

export interface ICreateTodoUseCase {
  execute(token: string, userId: number, todoData: CreateTodoDTO): Promise<Todo>;
}

export interface IUpdateTodoUseCase {
  execute(token: string, userId: number, todoId: number, todoData: UpdateTodoDTO): Promise<Todo>;
}

export interface IDeleteTodoUseCase {
  execute(token: string, userId: number, todoId: number): Promise<boolean>;
}

export interface IToggleTodoCompletionUseCase {
  execute(token: string, userId: number, todoId: number): Promise<Todo>;
}

export class GetTodosUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  execute: (token: string, userId: number) => Promise<Todo[]> =
    async (token: string, userId: number): Promise<Todo[]> => {
      // In a real implementation, we might want to validate that the user
      // can only get their own todos, but the backend handles this
      return await this.todoRepository.getTodos(token);
    }
}

export class CreateTodoUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  execute: (token: string, userId: number, todoData: CreateTodoDTO) => Promise<Todo> =
    async (token: string, userId: number, todoData: CreateTodoDTO): Promise<Todo> => {
      // Create a new Todo entity with the provided data
      const newTodo = new Todo(
        0, // ID will be assigned by the backend
        userId,
        todoData.title,
        todoData.description,
        todoData.dueDate
      );

      // Validate the entity before saving
      newTodo.validate();

      // Save the entity using the repository
      return await this.todoRepository.createTodo(token, newTodo);
    }
}

export class UpdateTodoUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  execute: (token: string, userId: number, todoId: number, todoData: UpdateTodoDTO) => Promise<Todo> =
    async (token: string, userId: number, todoId: number, todoData: UpdateTodoDTO): Promise<Todo> => {
      // Get the existing todo
      const todos = await this.todoRepository.getTodos(token);
      const existingTodo = todos.find(todo => todo.id === todoId && todo.belongsToUser(userId));

      if (!existingTodo) {
        throw new Error('Todo not found or access denied');
      }

      // Update the entity with the provided data
      if (todoData.title !== undefined) existingTodo.setTitle(todoData.title);
      if (todoData.description !== undefined) existingTodo.setDescription(todoData.description);
      if (todoData.dueDate !== undefined) existingTodo.setDueDate(todoData.dueDate);
      if (todoData.isCompleted !== undefined) {
        existingTodo.isCompleted = todoData.isCompleted;
        existingTodo.updatedAt = new Date();
      }

      // Validate the updated entity
      existingTodo.validate();

      // Save the updated entity using the repository
      return await this.todoRepository.updateTodo(token, todoId, existingTodo);
    }
}

export class DeleteTodoUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  execute: (token: string, userId: number, todoId: number) => Promise<boolean> =
    async (token: string, userId: number, todoId: number): Promise<boolean> => {
      // Get the existing todo to verify ownership
      const todos = await this.todoRepository.getTodos(token);
      const existingTodo = todos.find(todo => todo.id === todoId && todo.belongsToUser(userId));

      if (!existingTodo) {
        throw new Error('Todo not found or access denied');
      }

      // Delete the todo using the repository
      return await this.todoRepository.deleteTodo(token, todoId);
    }
}

export class ToggleTodoCompletionUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  execute: (token: string, userId: number, todoId: number) => Promise<Todo> =
    async (token: string, userId: number, todoId: number): Promise<Todo> => {
      // Get the existing todo to verify ownership
      const todos = await this.todoRepository.getTodos(token);
      const existingTodo = todos.find(todo => todo.id === todoId && todo.belongsToUser(userId));

      if (!existingTodo) {
        throw new Error('Todo not found or access denied');
      }

      // Toggle the completion status
      existingTodo.toggleCompletion();

      // Save the updated entity using the repository
      return await this.todoRepository.toggleComplete(token, todoId, existingTodo.isCompleted);
    }
}