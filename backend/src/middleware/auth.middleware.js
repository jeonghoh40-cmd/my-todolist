const { verifyToken } = require('../utils/jwt.utils');

/**
 * 인증 미들웨어
 * 요청 헤더에서 JWT 토큰을 추출하고 검증한 후,
 * 유효한 경우 사용자 정보를 req.user에 추가
 */
const authenticate = (req, res, next) => {
  // Authorization 헤더에서 토큰 추출 (Bearer 형식)
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"에서 토큰 부분만 추출

  if (!token) {
    // 토큰이 없는 경우 401 응답
    return res.status(401).json({
      error: 'E-101',
      message: 'Authentication required'
    });
  }

  // 토큰 검증
  const decoded = verifyToken(token);

  if (!decoded) {
    // 토큰이 유효하지 않은 경우 401 응답
    return res.status(401).json({
      error: 'E-101',
      message: 'Authentication required'
    });
  }

  // 토큰이 유효한 경우 사용자 정보를 req.user에 추가
  req.user = decoded;
  next(); // 다음 미들웨어로 진행
};

module.exports = {
  authenticate
};