export interface IUser {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
}

export class User implements IUser {
  id: number;
  username: string;
  email: string;
  createdAt: Date;

  constructor(id: number, username: string, email: string, createdAt: Date = new Date()) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.createdAt = createdAt;
  }

  // Business rules for user
  validateEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  updateEmail(newEmail: string): void {
    if (!newEmail || typeof newEmail !== 'string') {
      throw new Error('Email is required and must be a string');
    }
    if (!this.validateEmail(newEmail)) {
      throw new Error('Invalid email format');
    }
    this.email = newEmail;
  }

  updateUsername(newUsername: string): void {
    if (!newUsername || typeof newUsername !== 'string') {
      throw new Error('Username is required and must be a string');
    }
    if (newUsername.length < 3 || newUsername.length > 50) {
      throw new Error('Username must be between 3 and 50 characters');
    }
    this.username = newUsername;
  }
}