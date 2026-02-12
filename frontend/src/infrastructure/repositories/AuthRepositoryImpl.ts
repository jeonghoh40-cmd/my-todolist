import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { User } from '../../domain/entities/User';
import { authAPI } from '../../api/api';

export class AuthRepositoryImpl implements IAuthRepository {
  async register(username: string, password: string, email: string): Promise<{ user: User; token: string }> {
    const response = await authAPI.register({ username, password, email });
    
    const user = new User(
      response.user.id,
      response.user.username,
      response.user.email,
      new Date(response.user.createdAt)
    );
    
    return {
      user,
      token: response.token
    };
  }

  async login(username: string, password: string): Promise<{ user: User; token: string }> {
    const response = await authAPI.login({ username, password });
    
    const user = new User(
      response.user.id,
      response.user.username,
      response.user.email,
      new Date(response.user.createdAt)
    );
    
    return {
      user,
      token: response.token
    };
  }
}