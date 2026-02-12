const jwt = require('jsonwebtoken');
require('dotenv').config();
const TokenGeneratorInterface = require('../interfaces/TokenGeneratorInterface');

/**
 * Implementation of TokenGeneratorInterface using jsonwebtoken
 */
class TokenGeneratorImpl extends TokenGeneratorInterface {
  generateToken(payload) {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

    return jwt.sign(payload, secret, { expiresIn });
  }

  verifyToken(token) {
    try {
      const secret = process.env.JWT_SECRET;
      return jwt.verify(token, secret);
    } catch (error) {
      // 토큰이 만료되었거나 유효하지 않은 경우
      return null;
    }
  }
}

module.exports = TokenGeneratorImpl;