'use strict';

const bcrypt = require('bcryptjs');

/**
 * salt 생성
 * @returns {Promise<string>}
 */
const generateSalt = () => {
  return bcrypt.genSalt();
};

/**
 * 암호화된 비밀번호 생성
 * @param {string} password
 * @param {string} salt
 * @returns {Promise<string>}
 */
const generateHashPassword = (password, salt) => {
  return bcrypt.hash(password, salt);
};

/**
 * 비밀번호 검증
 * @param {string} inputPassword
 * @param {string} hashPassword
 * @param {string} salt
 * @returns {Promise<boolean>}
 */
const validatePassword = async (inputPassword, hashPassword, salt) => {
  const inputHashPassword = await generateHashPassword(inputPassword, salt);

  return inputHashPassword === hashPassword;
};

module.exports = {
  generateSalt,
  generateHashPassword,
  validatePassword,
};
