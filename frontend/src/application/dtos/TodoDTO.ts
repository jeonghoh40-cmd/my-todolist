import { Todo } from '../../domain/entities/Todo';

export interface CreateTodoDTO {
  title: string;
  description?: string;
  dueDate?: Date;
}

export interface UpdateTodoDTO {
  title?: string;
  description?: string;
  dueDate?: Date;
  isCompleted?: boolean;
}

export interface TodoResponseDTO {
  id: number;
  userId: number;
  title: string;
  description?: string;
  dueDate?: Date;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const mapTodoToDTO = (todo: Todo): TodoResponseDTO => {
  return {
    id: todo.id,
    userId: todo.userId,
    title: todo.title,
    description: todo.description,
    dueDate: todo.dueDate,
    isCompleted: todo.isCompleted,
    createdAt: todo.createdAt,
    updatedAt: todo.updatedAt
  };
};

export const mapTodoFromDTO = (dto: TodoResponseDTO): Todo => {
  return new Todo(
    dto.id,
    dto.userId,
    dto.title,
    dto.description,
    dto.dueDate,
    dto.isCompleted,
    dto.createdAt,
    dto.updatedAt
  );
};