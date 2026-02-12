const bcrypt = require('bcrypt');
const PasswordHasherInterface = require('../interfaces/PasswordHasherInterface');

/**
 * Implementation of PasswordHasherInterface using bcrypt
 */
class PasswordHasherImpl extends PasswordHasherInterface {
  async hashPassword(password) {
    const saltRounds = 10; // cost factor 10 이상
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}

module.exports = PasswordHasherImpl;