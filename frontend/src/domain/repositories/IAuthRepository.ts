import { User } from '../entities/User';

export interface IAuthRepository {
  register(username: string, password: string, email: string): Promise<{ user: User; token: string }>;
  login(username: string, password: string): Promise<{ user: User; token: string }>;
}