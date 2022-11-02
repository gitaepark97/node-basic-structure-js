'use strict';

const { BadRequestError } = require('../../src/exceptions/BadRequest.exception');
const { refresh_tokens } = require('../data.test');
const { TestRdbmsRepository } = require('./base/rdbms.repository.test');

class TestAuthRepository extends TestRdbmsRepository {
  upsert(options) {
    const date = new Date();
    const expire_date = new Date(new Date().setDate(date.getDate() + 14));

    const existRefreshToken = refresh_tokens.filter(
      refresh_token => refresh_token.user_id === options.user_id && refresh_token.ip === options.ip,
    )[0];

    if (existRefreshToken) {
      existRefreshToken.update_date = date;
      existRefreshToken.expire_date = expire_date;
      existRefreshToken.token = options.token;

      return;
    }

    const newRefreshToken = {
      ...options,
      create_date: date,
      update: date,
      expire_date: expire_date,
    };

    refresh_tokens.push(newRefreshToken);
  }

  async findByToken(options) {
    let result = {};

    const selectField = options?.select ? options.select.toString() : 'REFRESH_TOKENS.*';

    const refresh_token = refresh_tokens.filter(
      refresh_token => refresh_token.ip === options.where.ip && refresh_token.token === options.where.token,
    )[0];
    if (!refresh_token) throw new BadRequestError('wrong refresh_token or ip');

    if (selectField === 'REFRESH_TOKENS.*') {
      result = refresh_token;

      return result;
    }

    options.select.forEach(field => {
      result[field.split('.')[1]] = refresh_token[field.split('.')[1]];
    });

    return result;
  }
}

module.exports = { TestAuthRepository };
