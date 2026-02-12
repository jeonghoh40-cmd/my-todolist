/**
 * Interface for User Repository
 * Defines the contract for user data access operations
 */
class UserRepositoryInterface {
  /**
   * Creates a new user
   * @param {User} user - The user entity to create
   * @returns {Promise<User>} The created user
   */
  async createUser(user) {
    throw new Error('Method createUser must be implemented');
  }

  /**
   * Finds a user by username
   * @param {string} username - The username to search for
   * @returns {Promise<User|null>} The found user or null
   */
  async findByUsername(username) {
    throw new Error('Method findByUsername must be implemented');
  }

  /**
   * Finds a user by ID
   * @param {number} id - The user ID to search for
   * @returns {Promise<User|null>} The found user or null
   */
  async findById(id) {
    throw new Error('Method findById must be implemented');
  }
}

module.exports = UserRepositoryInterface;