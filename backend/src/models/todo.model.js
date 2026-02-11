const { pool } = require('../db/connection');

/**
 * 새로운 할일을 생성하는 함수
 * @param {number} userId 사용자 ID
 * @param {string} title 제목
 * @param {string} description 설명
 * @param {Date} dueDate 마감일
 * @returns {Promise<Object>} 생성된 할일 객체
 */
const createTodo = async (userId, title, description, dueDate) => {
  const query = `
    INSERT INTO todos (user_id, title, description, due_date) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *
  `;
  const values = [userId, title, description, dueDate];
  
  const result = await pool.query(query, values);
  return result.rows[0];
};

/**
 * 사용자 ID로 할일 목록을 조회하는 함수
 * @param {number} userId 사용자 ID
 * @returns {Promise<Array>} 할일 배열
 */
const findTodosByUserId = async (userId) => {
  const query = `
    SELECT * FROM todos 
    WHERE user_id = $1 
    ORDER BY created_at DESC
  `;
  const values = [userId];
  
  const result = await pool.query(query, values);
  return result.rows;
};

/**
 * 할일 ID로 할일을 조회하는 함수
 * @param {number} todoId 할일 ID
 * @returns {Promise<Object|null>} 할일 객체 또는 null
 */
const findTodoById = async (todoId) => {
  const query = 'SELECT * FROM todos WHERE id = $1';
  const values = [todoId];
  
  const result = await pool.query(query, values);
  return result.rows[0] || null;
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
  const query = `
    UPDATE todos 
    SET title = $1, description = $2, due_date = $3, updated_at = CURRENT_TIMESTAMP 
    WHERE id = $4 
    RETURNING *
  `;
  const values = [title, description, dueDate, todoId];
  
  const result = await pool.query(query, values);
  return result.rows[0];
};

/**
 * 할일을 삭제하는 함수
 * @param {number} todoId 할일 ID
 * @returns {Promise<boolean>} 삭제 성공 여부
 */
const deleteTodo = async (todoId) => {
  const query = 'DELETE FROM todos WHERE id = $1';
  const values = [todoId];
  
  const result = await pool.query(query, values);
  return result.rowCount > 0;
};

/**
 * 할일 완료 상태를 토글하는 함수
 * @param {number} todoId 할일 ID
 * @param {boolean} isCompleted 완료 상태
 * @returns {Promise<Object>} 수정된 할일 객체
 */
const toggleTodoComplete = async (todoId, isCompleted) => {
  const query = `
    UPDATE todos 
    SET is_completed = $1, updated_at = CURRENT_TIMESTAMP 
    WHERE id = $2 
    RETURNING *
  `;
  const values = [isCompleted, todoId];
  
  const result = await pool.query(query, values);
  return result.rows[0];
};

module.exports = {
  createTodo,
  findTodosByUserId,
  findTodoById,
  updateTodo,
  deleteTodo,
  toggleTodoComplete
};