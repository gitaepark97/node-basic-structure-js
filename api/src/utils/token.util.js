'use strict';

const jwt = require('jsonwebtoken');
const { config } = require('../config');

/**
 * access token 생성
 * @param {any} user
 * @returns {string}
 */
const generateAccessToken = user => {
  return jwt.sign(
    {
      user_id: user.id,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn },
  );
};

/**
 * refresh token 생성
 * @returns {string}
 */
const generateRefreshToken = () => {
  return jwt.sign({}, config.jwt.secret);
};

module.exports = { generateAccessToken, generateRefreshToken };
