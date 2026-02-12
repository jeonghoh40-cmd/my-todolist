import type { LoginRequest, RegisterRequest } from '../types/auth';
import type { CreateTodoRequest, UpdateTodoRequest } from '../types/todo';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiError extends Error {
  public code: string;
  public status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
    this.name = 'ApiError';
  }
}

async function handleResponse(response: Response) {
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.error || 'UNKNOWN_ERROR',
      data.message || '서버 오류가 발생했습니다',
      response.status
    );
  }

  return data;
}

export const authAPI = {
  async register(data: RegisterRequest) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  async login(data: LoginRequest) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },
};

export const todoAPI = {
  async getTodos(token: string) {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  async createTodo(token: string, data: CreateTodoRequest) {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  async updateTodo(token: string, todoId: number, data: UpdateTodoRequest) {
    const response = await fetch(`${API_BASE_URL}/todos/${todoId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  async deleteTodo(token: string, todoId: number) {
    const response = await fetch(`${API_BASE_URL}/todos/${todoId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return { success: true };
    }

    return handleResponse(response);
  },

  async toggleComplete(token: string, todoId: number, isCompleted: boolean) {
    const response = await fetch(`${API_BASE_URL}/todos/${todoId}/complete`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_completed: isCompleted }),
    });

    return handleResponse(response);
  },
};

export { ApiError };
