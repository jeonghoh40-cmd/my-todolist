export interface Todo {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  due_date?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  due_date?: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  due_date?: string;
}
