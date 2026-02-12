/**
 * Interface for Todo Repository
 * Defines the contract for todo data access operations
 */
class TodoRepositoryInterface {
  /**
   * Creates a new todo
   * @param {Todo} todo - The todo entity to create
   * @returns {Promise<Todo>} The created todo
   */
  async createTodo(todo) {
    throw new Error('Method createTodo must be implemented');
  }

  /**
   * Finds todos by user ID
   * @param {number} userId - The user ID to search for
   * @returns {Promise<Todo[]>} The found todos
   */
  async findTodosByUserId(userId) {
    throw new Error('Method findTodosByUserId must be implemented');
  }

  /**
   * Finds a todo by ID
   * @param {number} id - The todo ID to search for
   * @returns {Promise<Todo|null>} The found todo or null
   */
  async findTodoById(id) {
    throw new Error('Method findTodoById must be implemented');
  }

  /**
   * Updates a todo
   * @param {Todo} todo - The todo entity to update
   * @returns {Promise<Todo>} The updated todo
   */
  async updateTodo(todo) {
    throw new Error('Method updateTodo must be implemented');
  }

  /**
   * Deletes a todo by ID
   * @param {number} id - The todo ID to delete
   * @returns {Promise<boolean>} True if deletion was successful
   */
  async deleteTodo(id) {
    throw new Error('Method deleteTodo must be implemented');
  }
}

module.exports = TodoRepositoryInterface;