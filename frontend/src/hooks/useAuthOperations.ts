import { useState } from 'react';
import { registerUseCase, loginUseCase } from '../composition-root';
import type { User } from '../domain/entities/User';
import type { User as AuthUser } from '../types/auth';
import { useAuth } from '../contexts/AuthContext';

interface UseAuthOperationsReturn {
  register: (username: string, password: string, email: string) => Promise<{ user: User; token: string }>;
  login: (username: string, password: string) => Promise<{ user: User; token: string }>;
  logout: () => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useAuthOperations = (): UseAuthOperationsReturn => {
  const { login: contextLogin, logout: contextLogout } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const register = async (username: string, password: string, email: string): Promise<{ user: User; token: string }> => {
    setError(null);
    try {
      const result = await registerUseCase.execute({ username, password, email });

      // Convert domain User to AuthUser for context
      const authUser: AuthUser = {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        created_at: result.user.createdAt.toISOString()
      };

      // Update the auth context with the new user and token
      contextLogin(result.token, authUser);

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '회원가입에 실패했습니다';
      setError(errorMessage);
      throw err;
    }
  };

  const login = async (username: string, password: string): Promise<{ user: User; token: string }> => {
    setError(null);
    try {
      const result = await loginUseCase.execute({ username, password });

      // Convert domain User to AuthUser for context
      const authUser: AuthUser = {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        created_at: result.user.createdAt.toISOString()
      };

      // Update the auth context with the user and token
      contextLogin(result.token, authUser);

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '로그인에 실패했습니다';
      setError(errorMessage);
      throw err;
    }
  };

  const logout = () => {
    contextLogout();
  };

  return {
    register,
    login,
    logout,
    error,
    setError
  };
};