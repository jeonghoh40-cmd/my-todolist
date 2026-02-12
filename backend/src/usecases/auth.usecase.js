/**
 * Register User Use Case
 * Implements the business logic for user registration
 */
class RegisterUserUseCase {
  constructor(userRepository, passwordHasher) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute(userData) {
    const { username, password, email } = userData;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw { code: 'E-003', message: 'Invalid email format', status: 400 };
    }

    // Check if username already exists
    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      throw { code: 'E-001', message: 'Username already exists', status: 409 };
    }

    // Hash the password
    const hashedPassword = await this.passwordHasher.hashPassword(password);

    // Create the user entity
    const user = new (require('../entities/User'))(null, username, hashedPassword, email);

    // Save the user
    const createdUser = await this.userRepository.createUser(user);

    return {
      id: createdUser.id,
      username: createdUser.username,
      email: createdUser.email,
      createdAt: createdUser.createdAt
    };
  }
}

/**
 * Login User Use Case
 * Implements the business logic for user login
 */
class LoginUserUseCase {
  constructor(userRepository, passwordHasher, tokenGenerator) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenGenerator = tokenGenerator;
  }

  async execute(credentials) {
    const { username, password } = credentials;

    // Find user by username
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw { code: 'E-002', message: 'Invalid credentials', status: 401 };
    }

    // Verify password
    const isValidPassword = await this.passwordHasher.comparePassword(password, user.password);
    if (!isValidPassword) {
      throw { code: 'E-002', message: 'Invalid credentials', status: 401 };
    }

    // Generate token
    const token = this.tokenGenerator.generateToken({ userId: user.id, username: user.username });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      },
      token
    };
  }
}

module.exports = {
  RegisterUserUseCase,
  LoginUserUseCase
};