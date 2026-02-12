import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { User } from '../../domain/entities/User';
import { RegisterDTO, LoginDTO } from '../dtos/AuthDTO';

export interface IRegisterUseCase {
  execute(userData: RegisterDTO): Promise<{ user: User; token: string }>;
}

export interface ILoginUseCase {
  execute(userData: LoginDTO): Promise<{ user: User; token: string }>;
}

export class RegisterUseCase implements IRegisterUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(userData: RegisterDTO): Promise<{ user: User; token: string }> {
    // Create a temporary user entity to validate the data
    const tempUser = new User(0, userData.username, userData.email);

    // Validate email format
    if (!tempUser.validateEmail()) {
      throw new Error('Invalid email format');
    }

    // Additional validation could be added here

    // Register the user via the repository
    return await this.authRepository.register(userData.username, userData.password, userData.email);
  }
}

export class LoginUseCase implements ILoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(userData: LoginDTO): Promise<{ user: User; token: string }> {
    // Login the user via the repository
    return await this.authRepository.login(userData.username, userData.password);
  }
}