/**
 * DEPRECATED: This file is deprecated. Use the Clean Architecture implementation instead.
 * See ./src/usecases/todo.usecase.js for the new implementation.
 * 
 * This file remains for backward compatibility during migration.
 */

const {
  CreateTodoUseCase,
  GetTodosUseCase,
  UpdateTodoUseCase,
  DeleteTodoUseCase,
  ToggleTodoCompletionUseCase
} = require('../usecases/todo.usecase');
const TodoRepositoryImpl = require('../frameworks-and-drivers/TodoRepositoryImpl');

// Initialize dependencies
const todoRepository = new TodoRepositoryImpl();

// Initialize use cases
const createTodoUseCase = new CreateTodoUseCase(todoRepository);
const getTodosUseCase = new GetTodosUseCase(todoRepository);
const updateTodoUseCase = new UpdateTodoUseCase(todoRepository);
const deleteTodoUseCase = new DeleteTodoUseCase(todoRepository);
const toggleTodoCompletionUseCase = new ToggleTodoCompletionUseCase(todoRepository);

/**
 * 할일 생성 서비스
 * @param {number} userId 사용자 ID
 * @param {Object} data 할일 데이터 (title, description, dueDate)
 * @returns {Promise<Object>} 생성된 할일 객체
 */
const createTodoService = async (userId, data) => {
  try {
    // Execute the use case
    const todo = await createTodoUseCase.execute(userId, data);
    
    return todo;
  } catch (error) {
    // Re-throw the error to maintain the same interface
    throw error;
  }
};

/**
 * 사용자의 할일 목록 조회 서비스
 * @param {number} userId 사용자 ID
 * @returns {Promise<Array>} 할일 배열
 */
const getTodosService = async (userId) => {
  try {
    // Execute the use case
    const todos = await getTodosUseCase.execute(userId);
    
    return todos;
  } catch (error) {
    // Re-throw the error to maintain the same interface
    throw error;
  }
};

/**
 * 할일 수정 서비스
 * @param {number} userId 사용자 ID
 * @param {number} todoId 할일 ID
 * @param {Object} data 수정할 데이터 (title, description, dueDate)
 * @returns {Promise<Object>} 수정된 할일 객체
 */
const updateTodoService = async (userId, todoId, data) => {
  try {
    // Execute the use case
    const todo = await updateTodoUseCase.execute(userId, todoId, data);
    
    return todo;
  } catch (error) {
    // Re-throw the error to maintain the same interface
    throw error;
  }
};

/**
 * 할일 삭제 서비스
 * @param {number} userId 사용자 ID
 * @param {number} todoId 할일 ID
 * @returns {Promise<boolean>} 삭제 성공 여부
 */
const deleteTodoService = async (userId, todoId) => {
  try {
    // Execute the use case
    const result = await deleteTodoUseCase.execute(userId, todoId);
    
    return result;
  } catch (error) {
    // Re-throw the error to maintain the same interface
    throw error;
  }
};

/**
 * 할일 완료 상태 토글 서비스
 * @param {number} userId 사용자 ID
 * @param {number} todoId 할일 ID
 * @returns {Promise<Object>} 수정된 할일 객체
 */
const toggleCompleteService = async (userId, todoId) => {
  try {
    // Execute the use case
    const todo = await toggleTodoCompletionUseCase.execute(userId, todoId);
    
    return todo;
  } catch (error) {
    // Re-throw the error to maintain the same interface
    throw error;
  }
};

module.exports = {
  createTodoService,
  getTodosService,
  updateTodoService,
  deleteTodoService,
  toggleCompleteService
};