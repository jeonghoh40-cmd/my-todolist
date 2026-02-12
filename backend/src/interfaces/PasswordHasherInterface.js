/**
 * Interface for Password Hashing
 * Defines the contract for password hashing operations
 */
class PasswordHasherInterface {
  /**
   * Hashes a password
   * @param {string} password - The plain text password
   * @returns {Promise<string>} The hashed password
   */
  async hashPassword(password) {
    throw new Error('Method hashPassword must be implemented');
  }

  /**
   * Compares a password with a hash
   * @param {string} password - The plain text password
   * @param {string} hash - The hash to compare against
   * @returns {Promise<boolean>} True if the password matches the hash
   */
  async comparePassword(password, hash) {
    throw new Error('Method comparePassword must be implemented');
  }
}

module.exports = PasswordHasherInterface;