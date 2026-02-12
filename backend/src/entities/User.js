/**
 * User Entity representing the business object
 */
class User {
  constructor(id, username, password, email, createdAt) {
    this.id = id;
    this.username = username;
    this.password = password; // This should be hashed
    this.email = email;
    this.createdAt = createdAt || new Date();
  }

  // Business rules for user
  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  updateEmail(newEmail) {
    if (!newEmail || typeof newEmail !== 'string') {
      throw new Error('Email is required and must be a string');
    }
    if (!this.validateEmail(newEmail)) {
      throw new Error('Invalid email format');
    }
    this.email = newEmail;
  }

  updateUsername(newUsername) {
    if (!newUsername || typeof newUsername !== 'string') {
      throw new Error('Username is required and must be a string');
    }
    if (newUsername.length < 3 || newUsername.length > 50) {
      throw new Error('Username must be between 3 and 50 characters');
    }
    this.username = newUsername;
  }
}

module.exports = User;