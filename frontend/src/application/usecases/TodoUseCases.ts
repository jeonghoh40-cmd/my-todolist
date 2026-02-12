import { ITodoRepository } from '../../domain/repositories/ITodoRepository';
import { Todo } from '../../domain/entities/Todo';
import { CreateTodoDTO, UpdateTodoDTO } from '../dtos/TodoDTO';

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

export class GetTodosUseCase implements IGetTodosUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(token: string, userId: number): Promise<Todo[]> {
    // In a real implementation, we might want to validate that the user
    // can only get their own todos, but the backend handles this
    return await this.todoRepository.getTodos(token);
  }
}

export class CreateTodoUseCase implements ICreateTodoUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(token: string, userId: number, todoData: CreateTodoDTO): Promise<Todo> {
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

export class UpdateTodoUseCase implements IUpdateTodoUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(token: string, userId: number, todoId: number, todoData: UpdateTodoDTO): Promise<Todo> {
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

export class DeleteTodoUseCase implements IDeleteTodoUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(token: string, userId: number, todoId: number): Promise<boolean> {
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

export class ToggleTodoCompletionUseCase implements IToggleTodoCompletionUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(token: string, userId: number, todoId: number): Promise<Todo> {
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