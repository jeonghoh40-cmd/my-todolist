/**
 * DEPRECATED: This file is deprecated. Use the Clean Architecture implementation instead.
 * See ./src/usecases/auth.usecase.js for the new implementation.
 * 
 * This file remains for backward compatibility during migration.
 */

const { RegisterUserUseCase, LoginUserUseCase } = require('../usecases/auth.usecase');
const UserRepositoryImpl = require('../frameworks-and-drivers/UserRepositoryImpl');
const PasswordHasherImpl = require('../frameworks-and-drivers/PasswordHasherImpl');
const TokenGeneratorImpl = require('../frameworks-and-drivers/TokenGeneratorImpl');

// Initialize dependencies
const userRepository = new UserRepositoryImpl();
const passwordHasher = new PasswordHasherImpl();
const tokenGenerator = new TokenGeneratorImpl();

// Initialize use cases
const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher);
const loginUserUseCase = new LoginUserUseCase(userRepository, passwordHasher, tokenGenerator);

/**
 * 사용자 등록 서비스
 * @param {string} username 사용자 이름
 * @param {string} password 비밀번호
 * @param {string} email 이메일
 * @returns {Promise<Object>} 생성된 사용자 정보
 */
const register = async (username, password, email) => {
  try {
    // Execute the use case
    const userData = await registerUserUseCase.execute({ username, password, email });
    
    return userData;
  } catch (error) {
    // Re-throw the error to maintain the same interface
    throw error;
  }
};

/**
 * 사용자 로그인 서비스
 * @param {string} username 사용자 이름
 * @param {string} password 비밀번호
 * @returns {Promise<Object>} 사용자 정보와 JWT 토큰
 */
const login = async (username, password) => {
  try {
    // Execute the use case
    const result = await loginUserUseCase.execute({ username, password });
    
    return result;
  } catch (error) {
    // Re-throw the error to maintain the same interface
    throw error;
  }
};

module.exports = {
  register,
  login
};