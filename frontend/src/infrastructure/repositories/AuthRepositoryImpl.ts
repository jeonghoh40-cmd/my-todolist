import { User } from '../../domain/entities/User';
import { authAPI } from '../../api/api';

// Define the interface type for reference
interface IAuthRepository {
  register(username: string, password: string, email: string): Promise<{ user: User; token: string }>;
  login(username: string, password: string): Promise<{ user: User; token: string }>;
}

export class AuthRepositoryImpl {
  register: (username: string, password: string, email: string) => Promise<{ user: User; token: string }> =
    async (username: string, password: string, email: string): Promise<{ user: User; token: string }> => {
      const response = await authAPI.register({ username, password, email });

      const user = new User(
        response.user.id,
        response.user.username,
        response.user.email,
        new Date(response.user.created_at)
      );

      return {
        user,
        token: response.token
      };
    }

  login: (username: string, password: string) => Promise<{ user: User; token: string }> =
    async (username: string, password: string): Promise<{ user: User; token: string }> => {
      const response = await authAPI.login({ username, password });

      const user = new User(
        response.user.id,
        response.user.username,
        response.user.email,
        new Date(response.user.created_at)
      );

      return {
        user,
        token: response.token
      };
    }
}