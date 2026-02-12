/**
 * Interface for Token Generation
 * Defines the contract for token generation and verification
 */
class TokenGeneratorInterface {
  /**
   * Generates a token
   * @param {Object} payload - The data to include in the token
   * @returns {string} The generated token
   */
  generateToken(payload) {
    throw new Error('Method generateToken must be implemented');
  }

  /**
   * Verifies a token
   * @param {string} token - The token to verify
   * @returns {Object|null} The decoded payload or null if invalid
   */
  verifyToken(token) {
    throw new Error('Method verifyToken must be implemented');
  }
}

module.exports = TokenGeneratorInterface;