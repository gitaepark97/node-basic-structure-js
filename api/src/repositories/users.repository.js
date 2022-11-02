'use strict';

const { NotFoundError } = require('../exceptions/NotFound.exception');
const { RdbmsRepository } = require('./base/rdbms.repository');

class UsersRepository extends RdbmsRepository {
  /**
   * 회원 생성
   * @param {{email: string, password: string, salt: string}} options
   * @returns {Promise<any>}
   */
  create(options) {
    const id = 'US' + this.generateIdNumber();
    const create_date = new Date();

    return this.sendQuerys([
      {
        query: 'INSERT INTO USERS (id, email, password, create_date, update_date, salt) VALUES (?, ?, ?, ?, ?, ?);',
        params: [id, options.email, options.password, create_date, create_date, options.salt],
      },
    ]);
  }

  /**
   * 회원 수정
   * @param {{password?: string, name?: string, delete_date?: Date, image_url?: string, salt?: string, is_connect?: number, id: string}} options
   * @returns {Promise<any>}
   */
  update(options) {
    const update_date = new Date();

    return this.sendQuerys([
      {
        query:
          'UPDATE USERS SET password = COALESCE(?, password), name = COALESCE(?, name), update_date = ?, delete_date = ?, image_url = COALESCE(?, image_url), salt = COALESCE(?, salt), is_connect = COALESCE(?, is_connect) WHERE id = ?;',
        params: [
          options?.password || null,
          options?.name || null,
          update_date,
          options?.delete_date || null,
          options?.image_url || null,
          options?.salt || null,
          options?.is_connect ?? null,
          options.id,
        ],
      },
    ]);
  }

  /**
   * 회원 삭제 플래그 처리
   * @param {string} id
   * @returns
   */
  softDeleteById(id) {
    const delete_date = new Date();

    return this.sendQuerys([
      { query: 'UPDATE USERS SET delete_date = ? WHERE id = ?;', params: [delete_date, id] },
      { query: 'DELETE FROM REFRESH_TOKENS WHERE user_id = ?;', params: [id] },
    ]);
  }

  /**
   * 회원 전체 목록 조회
   * @param {{select: string[]}} options
   * @returns {Promise<[any[], number]>}
   */
  async findAndCount(options = null) {
    const selectField = options?.select
      ? options.select.toString()
      : 'USERS.id, USERS.email, USERS.name, USERS.create_date, USERS.update_date, USERS.delete_date, USERS.image_url, USERS.is_connect';

    const [users, counts] = await this.sendSelectQuerys([
      // 삭제 회원 제외
      { query: `SELECT SQL_CALC_FOUND_ROWS ${selectField} FROM USERS WHERE delete_date IS NULL;` },
      { query: 'SELECT FOUND_ROWS() AS count;' },
    ]);

    return [users, counts[0].count];
  }

  /**
   * id별 회원 조회
   * @param {string} id
   * @param {{select: string[]}} options
   * @returns {Promise<any>}
   */
  async findById(id, options = null) {
    const selectField = options?.select
      ? options.select.toString()
      : 'USERS.id, USERS.email, USERS.name, USERS.create_date, USERS.update_date, USERS.delete_date, USERS.image_url, USERS.is_connect';

    const user = (
      await this.sendSelectQuerys([{ query: `SELECT ${selectField} FROM USERS WHERE id = ?;`, params: [id] }])
    )[0][0];
    // 회원 검증
    if (!user) throw new NotFoundError('user');

    return user;
  }

  /**
   * email별 회원 조회
   * @param {string} email
   * @param {{select: string[]}} options
   * @returns {Promise<any>}
   */
  async findByEmail(email, options = null) {
    const selectField = options?.select ? options.select.toString() : 'USERS.*';

    return (
      await this.sendSelectQuerys([{ query: `SELECT ${selectField} FROM USERS WHERE email = ?;`, params: [email] }])
    )[0][0];
  }
}

module.exports = { UsersRepository };
