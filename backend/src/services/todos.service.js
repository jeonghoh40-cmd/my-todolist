const { 
  createTodo, 
  findTodosByUserId, 
  findTodoById, 
  updateTodo, 
  deleteTodo, 
  toggleTodoComplete 
} = require('../models/todo.model');

/**
 * 할일 생성 서비스
 * @param {number} userId 사용자 ID
 * @param {Object} data 할일 데이터 (title, description, dueDate)
 * @returns {Promise<Object>} 생성된 할일 객체
 */
const createTodoService = async (userId, data) => {
  const { title, description, dueDate } = data;

  // title 필수 검증
  if (!title) {
    throw { code: 'E-103', message: 'Title is required', status: 400 };
  }

  // createTodo 호출
  return await createTodo(userId, title, description, dueDate);
};

/**
 * 사용자의 할일 목록 조회 서비스
 * @param {number} userId 사용자 ID
 * @returns {Promise<Array>} 할일 배열
 */
const getTodosService = async (userId) => {
  return await findTodosByUserId(userId);
};

/**
 * 할일 수정 서비스
 * @param {number} userId 사용자 ID
 * @param {number} todoId 할일 ID
 * @param {Object} data 수정할 데이터 (title, description, dueDate)
 * @returns {Promise<Object>} 수정된 할일 객체
 */
const updateTodoService = async (userId, todoId, data) => {
  const { title, description, dueDate } = data;

  // 할일 조회
  const todo = await findTodoById(todoId);
  if (!todo) {
    throw { code: 'E-104', message: 'Todo not found', status: 404 };
  }

  // 소유권 검증
  if (todo.user_id !== userId) {
    throw { code: 'E-102', message: 'Access denied', status: 403 };
  }

  // title 필수 검증
  if (!title) {
    throw { code: 'E-103', message: 'Title is required', status: 400 };
  }

  // updateTodo 호출
  return await updateTodo(todoId, title, description, dueDate);
};

/**
 * 할일 삭제 서비스
 * @param {number} userId 사용자 ID
 * @param {number} todoId 할일 ID
 * @returns {Promise<boolean>} 삭제 성공 여부
 */
const deleteTodoService = async (userId, todoId) => {
  // 할일 조회
  const todo = await findTodoById(todoId);
  if (!todo) {
    throw { code: 'E-104', message: 'Todo not found', status: 404 };
  }

  // 소유권 검증
  if (todo.user_id !== userId) {
    throw { code: 'E-102', message: 'Access denied', status: 403 };
  }

  // deleteTodo 호출
  return await deleteTodo(todoId);
};

/**
 * 할일 완료 상태 토글 서비스
 * @param {number} userId 사용자 ID
 * @param {number} todoId 할일 ID
 * @returns {Promise<Object>} 수정된 할일 객체
 */
const toggleCompleteService = async (userId, todoId) => {
  // 할일 조회
  const todo = await findTodoById(todoId);
  if (!todo) {
    throw { code: 'E-104', message: 'Todo not found', status: 404 };
  }

  // 소유권 검증
  if (todo.user_id !== userId) {
    throw { code: 'E-102', message: 'Access denied', status: 403 };
  }

  // 현재 상태의 반대로 토글
  const newStatus = !todo.is_completed;
  
  // toggleTodoComplete 호출
  return await toggleTodoComplete(todoId, newStatus);
};

module.exports = {
  createTodoService,
  getTodosService,
  updateTodoService,
  deleteTodoService,
  toggleCompleteService
};