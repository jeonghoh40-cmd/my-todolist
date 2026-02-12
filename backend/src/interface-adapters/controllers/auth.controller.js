const { RegisterUserUseCase, LoginUserUseCase } = require('../../usecases/auth.usecase');
const UserRepositoryImpl = require('../../frameworks-and-drivers/UserRepositoryImpl');
const PasswordHasherImpl = require('../../frameworks-and-drivers/PasswordHasherImpl');
const TokenGeneratorImpl = require('../../frameworks-and-drivers/TokenGeneratorImpl');

// Initialize dependencies
const userRepository = new UserRepositoryImpl();
const passwordHasher = new PasswordHasherImpl();
const tokenGenerator = new TokenGeneratorImpl();

// Initialize use cases
const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher);
const loginUserUseCase = new LoginUserUseCase(userRepository, passwordHasher, tokenGenerator);

/**
 * Register Controller - Interface Adapter for registration
 */
const registerController = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Input validation
    if (!username || !password || !email) {
      return res.status(400).json({
        error: 'E-004',
        message: 'Username, password, and email are required'
      });
    }

    // Execute use case
    const user = await registerUserUseCase.execute({ username, password, email });

    // Return response
    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    // Error handling
    const statusCode = error.status || 500;
    const errorCode = error.code || 'E-999';
    const message = error.message || 'Internal server error';

    res.status(statusCode).json({
      error: errorCode,
      message: message
    });
  }
};

/**
 * Login Controller - Interface Adapter for login
 */
const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Execute use case
    const result = await loginUserUseCase.execute({ username, password });

    // Return response
    res.status(200).json({
      user: result.user,
      token: result.token
    });
  } catch (error) {
    // Error handling
    const statusCode = error.status || 500;
    const errorCode = error.code || 'E-999';
    const message = error.message || 'Internal server error';

    res.status(statusCode).json({
      error: errorCode,
      message: message
    });
  }
};

module.exports = {
  registerController,
  loginController
};