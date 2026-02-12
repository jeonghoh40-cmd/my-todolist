const { pool } = require('../db/connection');
const User = require('../entities/User');
const UserRepositoryInterface = require('../interfaces/UserRepositoryInterface');

/**
 * Implementation of UserRepositoryInterface using PostgreSQL
 */
class UserRepositoryImpl extends UserRepositoryInterface {
  async createUser(user) {
    const query = `
      INSERT INTO users (username, password, email) 
      VALUES ($1, $2, $3) 
      RETURNING id, username, email, created_at
    `;
    const values = [user.username, user.password, user.email];
    
    const result = await pool.query(query, values);
    const userData = result.rows[0];
    
    return new User(
      userData.id, 
      userData.username, 
      userData.password, 
      userData.email, 
      userData.created_at
    );
  }

  async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const values = [username];
    
    const result = await pool.query(query, values);
    const userData = result.rows[0];
    
    if (!userData) return null;
    
    return new User(
      userData.id, 
      userData.username, 
      userData.password, 
      userData.email, 
      userData.created_at
    );
  }

  async findById(id) {
    const query = 'SELECT id, username, email, created_at FROM users WHERE id = $1';
    const values = [id];
    
    const result = await pool.query(query, values);
    const userData = result.rows[0];
    
    if (!userData) return null;
    
    return new User(
      userData.id, 
      userData.username, 
      null, // Don't return password for security
      userData.email, 
      userData.created_at
    );
  }
}

module.exports = UserRepositoryImpl;