'use strict';

const { NosqlRepository } = require('./base/nosql.repository');

class MemosRepository extends NosqlRepository {
  /**
   * 메모 생성
   * @param {{user_id: string, memo: string}} options
   * @returns {Promise<any>}
   */
  create(options) {
    const create_date = new Date();

    return this.sendQuerys([
      {
        query: 'INSERT INTO MEMOS (user_id, memo, create_date) VALUES (?, ?, ?)',
        params: [options.user_id, options.memo, create_date],
      },
    ]);
  }

  /**
   * 회원별 메모 목록 조회
   * @param {{select: string[]}} options
   * @returns {Promise<Memo[]>}
   */
  async findByUserId(user_id, options = null) {
    const selectField = options?.select.toString() || '*';

    return (
      await this.sendQuerys([{ query: `SELECT ${selectField} FROM MEMOS WHERE user_id = ?;`, params: [user_id] }])
    )[0];
  }
}

module.exports = { MemosRepository };
