const { pool } = require('../db/connection');
const Todo = require('../entities/Todo');
const TodoRepositoryInterface = require('../interfaces/TodoRepositoryInterface');

/**
 * Implementation of TodoRepositoryInterface using PostgreSQL
 */
class TodoRepositoryImpl extends TodoRepositoryInterface {
  async createTodo(todo) {
    const query = `
      INSERT INTO todos (user_id, title, description, due_date) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;
    const values = [todo.userId, todo.title, todo.description, todo.dueDate];
    
    const result = await pool.query(query, values);
    const todoData = result.rows[0];
    
    return new Todo(
      todoData.id,
      todoData.user_id,
      todoData.title,
      todoData.description,
      todoData.due_date,
      todoData.is_completed,
      todoData.created_at,
      todoData.updated_at
    );
  }

  async findTodosByUserId(userId) {
    const query = `
      SELECT * FROM todos 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;
    const values = [userId];
    
    const result = await pool.query(query, values);
    const todosData = result.rows;
    
    return todosData.map(todoData => new Todo(
      todoData.id,
      todoData.user_id,
      todoData.title,
      todoData.description,
      todoData.due_date,
      todoData.is_completed,
      todoData.created_at,
      todoData.updated_at
    ));
  }

  async findTodoById(id) {
    const query = 'SELECT * FROM todos WHERE id = $1';
    const values = [id];
    
    const result = await pool.query(query, values);
    const todoData = result.rows[0];
    
    if (!todoData) return null;
    
    return new Todo(
      todoData.id,
      todoData.user_id,
      todoData.title,
      todoData.description,
      todoData.due_date,
      todoData.is_completed,
      todoData.created_at,
      todoData.updated_at
    );
  }

  async updateTodo(todo) {
    const query = `
      UPDATE todos 
      SET title = $1, description = $2, due_date = $3, is_completed = $4, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $5 
      RETURNING *
    `;
    const values = [todo.title, todo.description, todo.dueDate, todo.isCompleted, todo.id];
    
    const result = await pool.query(query, values);
    const todoData = result.rows[0];
    
    if (!todoData) return null;
    
    return new Todo(
      todoData.id,
      todoData.user_id,
      todoData.title,
      todoData.description,
      todoData.due_date,
      todoData.is_completed,
      todoData.created_at,
      todoData.updated_at
    );
  }

  async deleteTodo(id) {
    const query = 'DELETE FROM todos WHERE id = $1';
    const values = [id];
    
    const result = await pool.query(query, values);
    return result.rowCount > 0;
  }
}

module.exports = TodoRepositoryImpl;