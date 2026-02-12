const express = require('express');
const { registerController, loginController } = require('../interface-adapters/controllers/auth.controller');

const router = express.Router();

// POST /api/auth/register - 회원가입
router.post('/register', registerController);

// POST /api/auth/login - 로그인
router.post('/login', loginController);

module.exports = router;