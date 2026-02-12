/**
 * DEPRECATED: This file is deprecated. Use the Clean Architecture implementation instead.
 * See ./src/frameworks-and-drivers/UserRepositoryImpl.js for the new implementation.
 * 
 * This file remains for backward compatibility during migration.
 */

const UserRepositoryImpl = require('../frameworks-and-drivers/UserRepositoryImpl');
const User = require('../entities/User');

// Create a singleton instance of the new repository
const userRepository = new UserRepositoryImpl();

/**
 * 새로운 사용자를 생성하는 함수
 * @param {string} username 사용자 이름
 * @param {string} password 비밀번호 (해시화되어야 함)
 * @param {string} email 이메일
 * @returns {Promise<Object>} 생성된 사용자 객체
 */
const createUser = async (username, password, email) => {
  const userEntity = new User(null, username, password, email);
  const createdUser = await userRepository.createUser(userEntity);
  
  // Convert entity back to plain object for backward compatibility
  return {
    id: createdUser.id,
    username: createdUser.username,
    email: createdUser.email,
    created_at: createdUser.createdAt
  };
};

/**
 * 사용자 이름으로 사용자를 찾는 함수
 * @param {string} username 사용자 이름
 * @returns {Promise<Object|null>} 사용자 객체 또는 null
 */
const findUserByUsername = async (username) => {
  const userEntity = await userRepository.findByUsername(username);
  
  if (!userEntity) return null;
  
  // Convert entity back to plain object for backward compatibility
  return {
    id: userEntity.id,
    username: userEntity.username,
    password: userEntity.password,
    email: userEntity.email,
    created_at: userEntity.createdAt
  };
};

/**
 * 사용자 ID로 사용자를 찾는 함수
 * @param {number} userId 사용자 ID
 * @returns {Promise<Object|null>} 사용자 객체 또는 null
 */
const findUserById = async (userId) => {
  // Note: The new repository doesn't expose passwords for security
  // This function is kept for backward compatibility but won't return password
  const query = 'SELECT id, username, email, created_at FROM users WHERE id = $1';
  const { pool } = require('../db/connection');
  const values = [userId];

  const result = await pool.query(query, values);
  const userData = result.rows[0];
  
  if (!userData) return null;
  
  return {
    id: userData.id,
    username: userData.username,
    email: userData.email,
    created_at: userData.created_at
  };
};

module.exports = {
  createUser,
  findUserByUsername,
  findUserById
};