'use strict';

const { NotFoundError } = require('../exceptions/NotFound.exception');
const { RdbmsRepository } = require('./base/rdbms.repository');

class TasksRepository extends RdbmsRepository {
  /**
   * 다중 업무 생성
   * @param {{user_id: string, titles: string[]}} options
   * @returns {Promise<any>}
   */
  async createFromArray(options) {
    const sqls = [];

    options.titles.forEach(title => {
      const id = 'TK' + this.generateIdNumber();
      const create_date = new Date();

      sqls.push({
        query: 'INSERT INTO TASKS (id, user_id, title, create_date, update_date) VALUES (?, ?, ?, ?, ?);',
        params: [id, options.user_id, title, create_date, create_date],
      });
    });

    return this.sendQuerys(sqls);
  }

  /**
   * 회원별 업무 목록
   * @param {string} user_id
   * @param {{select: string[]}} options
   * @returns {Promise<[any[], number]>}
   */
  async findByUserIdAndCount(user_id, options = null) {
    const selectField = options?.select ? options.select.toString() : 'TASKS.*';

    const [tasks, counts] = await this.sendSelectQuerys([
      // 삭제 회원 제외
      {
        query: `SELECT SQL_CALC_FOUND_ROWS ${selectField} FROM TASKS JOIN USERS ON TASKS.user_id = USERS.id WHERE USERS.delete_date IS NULL AND TASKS.user_id = ?;`,
        params: [user_id],
      },
      { query: 'SELECT FOUND_ROWS() AS count;' },
    ]);

    return [tasks, counts[0].count];
  }

  /**
   * id별 업무 조회
   * @param {string} id
   * @param {{select: string[]}} options
   * @returns {Promise<any>}
   */
  async findById(id, options = null) {
    const selectField = options?.select ? options.select.toString() : 'TASKS.*';

    const task = (
      await this.sendSelectQuerys([{ query: `SELECT ${selectField} FROM TASKS WHERE id = ?;`, params: [id] }])
    )[0][0];
    // 업무 검증
    if (!task) throw new NotFoundError('task');

    return task;
  }

  /**
   * 업무 수정
   * @param {{title?: string, is_done?: number, id: string}} options
   * @returns {Promise<any>}
   */
  update(options) {
    const update_date = new Date();

    return this.sendQuerys([
      {
        query:
          'UPDATE TASKS SET title = COALESCE(?, title), is_done = COALESCE(?, is_done), update_date = ? WHERE id = ?;',
        params: [options?.title || null, options?.is_done ?? null, update_date, options.id],
      },
    ]);
  }
}

module.exports = { TasksRepository };
