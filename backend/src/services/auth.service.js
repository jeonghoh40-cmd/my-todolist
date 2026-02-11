const { createUser, findUserByUsername } = require('../models/user.model');
const { hashPassword, comparePassword } = require('../utils/password.utils');
const { generateToken } = require('../utils/jwt.utils');

// 이메일 형식 검증 정규식
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 사용자 등록 서비스
 * @param {string} username 사용자 이름
 * @param {string} password 비밀번호
 * @param {string} email 이메일
 * @returns {Promise<Object>} 생성된 사용자 정보
 */
const register = async (username, password, email) => {
  // 이메일 형식 검증
  if (!emailRegex.test(email)) {
    throw { code: 'E-003', message: 'Invalid email format', status: 400 };
  }

  // username 중복 확인
  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    throw { code: 'E-001', message: 'Username already exists', status: 409 };
  }

  // 비밀번호 해시
  const hashedPassword = await hashPassword(password);

  // 사용자 생성
  const user = await createUser(username, hashedPassword, email);
  
  return user;
};

/**
 * 사용자 로그인 서비스
 * @param {string} username 사용자 이름
 * @param {string} password 비밀번호
 * @returns {Promise<Object>} 사용자 정보와 JWT 토큰
 */
const login = async (username, password) => {
  // 사용자 조회
  const user = await findUserByUsername(username);
  if (!user) {
    throw { code: 'E-002', message: 'Invalid credentials', status: 401 };
  }

  // 비밀번호 검증
  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    throw { code: 'E-002', message: 'Invalid credentials', status: 401 };
  }

  // JWT 토큰 생성
  const token = generateToken({ userId: user.id, username: user.username });

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.created_at
    },
    token
  };
};

module.exports = {
  register,
  login
};