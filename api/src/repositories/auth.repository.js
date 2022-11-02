'use strict';

const { BadRequestError } = require('../exceptions/BadRequest.exception');
const { RdbmsRepository } = require('./base/rdbms.repository');

class AuthRepository extends RdbmsRepository {
  /**
   * refresh token 생성 및 수정
   * @param {{user_id: string, ip: string, token: string}} options
   * @returns {Promise<any>}
   */
  upsert(options) {
    const date = new Date();
    const expire_date = new Date(new Date().setDate(date.getDate() + 14));

    return this.sendQuerys([
      { query: 'SET @date = ?;', params: [date] },
      { query: 'SET @expire_date = ?;', params: [expire_date] },
      { query: 'SET @token = ?;', params: [options.token] },
      {
        query:
          'INSERT INTO REFRESH_TOKENS (user_id, ip, create_date, update_date, expire_date, token) VALUES (?, ?, @date, @date, @expire_date,  @token) ON DUPLICATE KEY UPDATE update_date = @date, expire_date = @expire_date, token = @token;',
        params: [options.user_id, options.ip],
      },
    ]);
  }

  /**
   * token별 refresh token 조회
   * @param {{select: string[]}} options
   * @returns {Promise<any>}
   */
  async findByToken(options = null) {
    const selectField = options?.select ? options.select.toString() : 'REFRESH_TOKENS.*';

    const refresh_token = (
      await this.sendSelectQuerys([
        {
          query: `SELECT ${selectField} FROM REFRESH_TOKENS WHERE ip = ? AND token = ?;`,
          params: [options.where.ip, options.where.token],
        },
      ])
    )[0][0];
    // refresh token 검증
    if (!refresh_token) throw new BadRequestError('wrong refresh_token or ip');

    return refresh_token;
  }
}

module.exports = { AuthRepository };
