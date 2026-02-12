export interface ITodo {
  id: number;
  userId: number;
  title: string;
  description?: string;
  dueDate?: Date;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Todo implements ITodo {
  id: number;
  userId: number;
  title: string;
  description?: string;
  dueDate?: Date;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    userId: number,
    title: string,
    description?: string,
    dueDate?: Date,
    isCompleted: boolean = false,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate ? new Date(dueDate) : undefined;
    this.isCompleted = isCompleted;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Business rules for todo
  validate(): void {
    if (!this.title || typeof this.title !== 'string' || this.title.trim().length === 0) {
      throw new Error('Title is required and must be a non-empty string');
    }
    if (this.title.length > 255) {
      throw new Error('Title must be less than 256 characters');
    }
    if (this.description && typeof this.description !== 'string') {
      throw new Error('Description must be a string');
    }
    if (this.dueDate && !(this.dueDate instanceof Date)) {
      throw new Error('Due date must be a valid date');
    }
    if (typeof this.isCompleted !== 'boolean') {
      throw new Error('IsCompleted must be a boolean');
    }
  }

  setTitle(title: string): void {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      throw new Error('Title is required and must be a non-empty string');
    }
    this.title = title;
    this.updatedAt = new Date();
  }

  setDescription(description?: string): void {
    if (description && typeof description !== 'string') {
      throw new Error('Description must be a string');
    }
    this.description = description;
    this.updatedAt = new Date();
  }

  setDueDate(dueDate?: Date): void {
    if (dueDate) {
      if (!(dueDate instanceof Date)) {
        throw new Error('Due date must be a valid date');
      }
      this.dueDate = dueDate;
    } else {
      this.dueDate = undefined;
    }
    this.updatedAt = new Date();
  }

  toggleCompletion(): void {
    this.isCompleted = !this.isCompleted;
    this.updatedAt = new Date();
  }

  belongsToUser(userId: number): boolean {
    return this.userId === userId;
  }
}