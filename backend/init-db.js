const { pool } = require('./src/db/connection');

async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Creating tables...');
    
    // Drop tables if they exist
    await client.query(`
      DROP TABLE IF EXISTS todos CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
    console.log('Existing tables dropped.');
    
    // Create users table
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Users table created.');
    
    // Create todos table
    await client.query(`
      CREATE TABLE todos (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        due_date DATE,
        is_completed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Todos table created.');
    
    // Create indexes
    await client.query(`
      CREATE INDEX idx_todos_user_id ON todos(user_id);
      CREATE INDEX idx_todos_is_completed ON todos(is_completed);
    `);
    console.log('Indexes created.');
    
    console.log('Database initialized successfully!');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

initializeDatabase();