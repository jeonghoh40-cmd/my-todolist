const bcrypt = require('bcrypt');

/**
 * 비밀번호를 해시화하는 함수
 * @param {string} password 원본 비밀번호
 * @returns {Promise<string>} 해시된 비밀번호
 */
const hashPassword = async (password) => {
  const saltRounds = 10; // cost factor 10 이상
  return await bcrypt.hash(password, saltRounds);
};

/**
 * 입력된 비밀번호와 해시된 비밀번호를 비교하는 함수
 * @param {string} password 원본 비밀번호
 * @param {string} hash 해시된 비밀번호
 * @returns {Promise<boolean>} 비밀번호가 일치하면 true, 아니면 false
 */
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = {
  hashPassword,
  comparePassword
};