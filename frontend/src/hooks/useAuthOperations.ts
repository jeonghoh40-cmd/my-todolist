import { useState } from 'react';
import { registerUseCase, loginUseCase } from '../composition-root';
import { User } from '../domain/entities/User';
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
      
      // Update the auth context with the new user and token
      contextLogin(result.token, result.user);
      
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
      
      // Update the auth context with the user and token
      contextLogin(result.token, result.user);
      
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