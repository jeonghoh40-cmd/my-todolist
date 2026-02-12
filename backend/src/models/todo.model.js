/**
 * DEPRECATED: This file is deprecated. Use the Clean Architecture implementation instead.
 * See ./src/frameworks-and-drivers/TodoRepositoryImpl.js for the new implementation.
 * 
 * This file remains for backward compatibility during migration.
 */

const TodoRepositoryImpl = require('../frameworks-and-drivers/TodoRepositoryImpl');
const Todo = require('../entities/Todo');

// Create a singleton instance of the new repository
const todoRepository = new TodoRepositoryImpl();

/**
 * 새로운 할일을 생성하는 함수
 * @param {number} userId 사용자 ID
 * @param {string} title 제목
 * @param {string} description 설명
 * @param {Date} dueDate 마감일
 * @returns {Promise<Object>} 생성된 할일 객체
 */
const createTodo = async (userId, title, description, dueDate) => {
  const todoEntity = new Todo(null, userId, title, description, dueDate);
  const createdTodo = await todoRepository.createTodo(todoEntity);
  
  // Convert entity back to plain object for backward compatibility
  return {
    id: createdTodo.id,
    user_id: createdTodo.userId,
    title: createdTodo.title,
    description: createdTodo.description,
    due_date: createdTodo.dueDate,
    is_completed: createdTodo.isCompleted,
    created_at: createdTodo.createdAt,
    updated_at: createdTodo.updatedAt
  };
};

/**
 * 사용자 ID로 할일 목록을 조회하는 함수
 * @param {number} userId 사용자 ID
 * @returns {Promise<Array>} 할일 배열
 */
const findTodosByUserId = async (userId) => {
  const todoEntities = await todoRepository.findTodosByUserId(userId);
  
  // Convert entities back to plain objects for backward compatibility
  return todoEntities.map(todoEntity => ({
    id: todoEntity.id,
    user_id: todoEntity.userId,
    title: todoEntity.title,
    description: todoEntity.description,
    due_date: todoEntity.dueDate,
    is_completed: todoEntity.isCompleted,
    created_at: todoEntity.createdAt,
    updated_at: todoEntity.updatedAt
  }));
};

/**
 * 할일 ID로 할일을 조회하는 함수
 * @param {number} todoId 할일 ID
 * @returns {Promise<Object|null>} 할일 객체 또는 null
 */
const findTodoById = async (todoId) => {
  const todoEntity = await todoRepository.findTodoById(todoId);
  
  if (!todoEntity) return null;
  
  // Convert entity back to plain object for backward compatibility
  return {
    id: todoEntity.id,
    user_id: todoEntity.userId,
    title: todoEntity.title,
    description: todoEntity.description,
    due_date: todoEntity.dueDate,
    is_completed: todoEntity.isCompleted,
    created_at: todoEntity.createdAt,
    updated_at: todoEntity.updatedAt
  };
};

/**
 * 할일을 수정하는 함수
 * @param {number} todoId 할일 ID
 * @param {string} title 제목
 * @param {string} description 설명
 * @param {Date} dueDate 마감일
 * @returns {Promise<Object>} 수정된 할일 객체
 */
const updateTodo = async (todoId, title, description, dueDate) => {
  // Find the existing todo first
  const existingTodo = await todoRepository.findTodoById(todoId);
  if (!existingTodo) return null;
  
  // Update the entity
  existingTodo.setTitle(title);
  existingTodo.setDescription(description);
  existingTodo.setDueDate(dueDate);
  
  const updatedTodo = await todoRepository.updateTodo(existingTodo);
  
  // Convert entity back to plain object for backward compatibility
  return {
    id: updatedTodo.id,
    user_id: updatedTodo.userId,
    title: updatedTodo.title,
    description: updatedTodo.description,
    due_date: updatedTodo.dueDate,
    is_completed: updatedTodo.isCompleted,
    created_at: updatedTodo.createdAt,
    updated_at: updatedTodo.updatedAt
  };
};

/**
 * 할일을 삭제하는 함수
 * @param {number} todoId 할일 ID
 * @returns {Promise<boolean>} 삭제 성공 여부
 */
const deleteTodo = async (todoId) => {
  return await todoRepository.deleteTodo(todoId);
};

/**
 * 할일 완료 상태를 토글하는 함수
 * @param {number} todoId 할일 ID
 * @param {boolean} isCompleted 완료 상태
 * @returns {Promise<Object>} 수정된 할일 객체
 */
const toggleTodoComplete = async (todoId, isCompleted) => {
  // Find the existing todo first
  const existingTodo = await todoRepository.findTodoById(todoId);
  if (!existingTodo) return null;
  
  // Toggle completion status
  existingTodo.isCompleted = isCompleted;
  existingTodo.updatedAt = new Date();
  
  const updatedTodo = await todoRepository.updateTodo(existingTodo);
  
  // Convert entity back to plain object for backward compatibility
  return {
    id: updatedTodo.id,
    user_id: updatedTodo.userId,
    title: updatedTodo.title,
    description: updatedTodo.description,
    due_date: updatedTodo.dueDate,
    is_completed: updatedTodo.isCompleted,
    created_at: updatedTodo.createdAt,
    updated_at: updatedTodo.updatedAt
  };
};

module.exports = {
  createTodo,
  findTodosByUserId,
  findTodoById,
  updateTodo,
  deleteTodo,
  toggleTodoComplete
};