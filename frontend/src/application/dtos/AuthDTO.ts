import { User } from '../../domain/entities/User';

export interface RegisterDTO {
  username: string;
  password: string;
  email: string;
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface AuthResponseDTO {
  user: User;
  token: string;
}