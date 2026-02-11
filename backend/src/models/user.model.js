const { pool } = require('../db/connection');

/**
 * 새로운 사용자를 생성하는 함수
 * @param {string} username 사용자 이름
 * @param {string} password 비밀번호 (해시화되어야 함)
 * @param {string} email 이메일
 * @returns {Promise<Object>} 생성된 사용자 객체
 */
const createUser = async (username, password, email) => {
  const query = `
    INSERT INTO users (username, password, email) 
    VALUES ($1, $2, $3) 
    RETURNING id, username, email, created_at
  `;
  const values = [username, password, email];
  
  const result = await pool.query(query, values);
  return result.rows[0];
};

/**
 * 사용자 이름으로 사용자를 찾는 함수
 * @param {string} username 사용자 이름
 * @returns {Promise<Object|null>} 사용자 객체 또는 null
 */
const findUserByUsername = async (username) => {
  const query = 'SELECT * FROM users WHERE username = $1';
  const values = [username];
  
  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

/**
 * 사용자 ID로 사용자를 찾는 함수
 * @param {number} userId 사용자 ID
 * @returns {Promise<Object|null>} 사용자 객체 또는 null
 */
const findUserById = async (userId) => {
  const query = 'SELECT id, username, email, created_at FROM users WHERE id = $1';
  const values = [userId];
  
  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

module.exports = {
  createUser,
  findUserByUsername,
  findUserById
};