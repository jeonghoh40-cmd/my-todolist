const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const {
  getTodosController,
  createTodoController,
  updateTodoController,
  deleteTodoController,
  toggleCompleteController
} = require('../interface-adapters/controllers/todo.controller');

const router = express.Router();

// 모든 라우트에 authenticate 미들웨어 적용
router.use(authenticate);

// GET /api/todos - 할일 목록 조회
router.get('/', getTodosController);

// POST /api/todos - 할일 추가
router.post('/', createTodoController);

// PUT /api/todos/:id - 할일 수정
router.put('/:id', updateTodoController);

// DELETE /api/todos/:id - 할일 삭제
router.delete('/:id', deleteTodoController);

// PATCH /api/todos/:id/complete - 할일 완료 처리
router.patch('/:id/complete', toggleCompleteController);

module.exports = router;