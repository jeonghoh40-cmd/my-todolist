const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * JWT 토큰을 생성하는 함수
 * @param {Object} payload 사용자 정보 (userId, username 등)
 * @returns {string} 생성된 JWT 토큰
 */
const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * JWT 토큰을 검증하는 함수
 * @param {string} token 검증할 토큰
 * @returns {Object|null} 검증된 토큰의 payload 또는 null
 */
const verifyToken = (token) => {
  try {
    const secret = process.env.JWT_SECRET;
    return jwt.verify(token, secret);
  } catch (error) {
    // 토큰이 만료되었거나 유효하지 않은 경우
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};