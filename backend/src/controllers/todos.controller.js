const { 
  getTodosService,
  createTodoService,
  updateTodoService,
  deleteTodoService,
  toggleCompleteService
} = require('../services/todos.service');

/**
 * 할일 목록 조회 컨트롤러
 */
const getTodosController = async (req, res) => {
  try {
    const userId = req.user.userId; // 인증 미들웨어에서 설정된 사용자 ID
    
    const todos = await getTodosService(userId);
    
    res.status(200).json(todos);
  } catch (error) {
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
 * 할일 생성 컨트롤러
 */
const createTodoController = async (req, res) => {
  try {
    const userId = req.user.userId; // 인증 미들웨어에서 설정된 사용자 ID
    const { title, description, dueDate } = req.body;

    const todo = await createTodoService(userId, { title, description, dueDate });
    
    res.status(201).json(todo);
  } catch (error) {
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
 * 할일 수정 컨트롤러
 */
const updateTodoController = async (req, res) => {
  try {
    const userId = req.user.userId; // 인증 미들웨어에서 설정된 사용자 ID
    const todoId = parseInt(req.params.id, 10);
    const { title, description, dueDate } = req.body;

    const todo = await updateTodoService(userId, todoId, { title, description, dueDate });
    
    res.status(200).json(todo);
  } catch (error) {
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
 * 할일 삭제 컨트롤러
 */
const deleteTodoController = async (req, res) => {
  try {
    const userId = req.user.userId; // 인증 미들웨어에서 설정된 사용자 ID
    const todoId = parseInt(req.params.id, 10);

    await deleteTodoService(userId, todoId);
    
    res.status(204).send(); // No Content
  } catch (error) {
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
 * 할일 완료 상태 토글 컨트롤러
 */
const toggleCompleteController = async (req, res) => {
  try {
    const userId = req.user.userId; // 인증 미들웨어에서 설정된 사용자 ID
    const todoId = parseInt(req.params.id, 10);

    const todo = await toggleCompleteService(userId, todoId);
    
    res.status(200).json(todo);
  } catch (error) {
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
  getTodosController,
  createTodoController,
  updateTodoController,
  deleteTodoController,
  toggleCompleteController
};