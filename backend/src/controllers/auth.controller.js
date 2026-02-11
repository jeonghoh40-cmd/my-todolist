const { register, login } = require('../services/auth.service');

/**
 * 회원가입 컨트롤러
 */
const registerController = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // 입력 검증 (필수 필드 확인)
    if (!username || !password || !email) {
      return res.status(400).json({
        error: 'E-004',
        message: 'Username, password, and email are required'
      });
    }

    // 서비스 호출
    const user = await register(username, password, email);

    // 성공 응답 (HTTP 201)
    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    // 에러 처리
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
 * 로그인 컨트롤러
 */
const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 서비스 호출
    const result = await login(username, password);

    // 성공 응답 (HTTP 200 + JWT 토큰)
    res.status(200).json({
      user: result.user,
      token: result.token
    });
  } catch (error) {
    // 에러 처리
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