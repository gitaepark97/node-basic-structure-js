'use strict';

const mysql = require('mysql2/promise');
const { config } = require('../../config');
const { InternalServerError } = require('../../exceptions/InternalServer.exception');
const { logger } = require('../../utils/logger.util');

class RdbmsRepository {
  constructor() {
    this.pool = mysql.createPool(config.rdbms);
  }

  /**
   *
   * @param {{query: string, params: any[]}[]} sqls
   * @returns {Promise<any>}
   */
  async sendQuerys(sqls) {
    let results = [];

    const connection = await this.getConnection();

    try {
      // 트랜잭션 처리
      await connection.beginTransaction();

      // 다중 sql
      for await (const sql of sqls) {
        let result = null;
        [result] = await connection.query(sql.query, sql?.params);
        results.push(result);
      }

      await connection.commit();
    } catch (err) {
      logger.error(`Rdbms query: ${err}`);
      await connection.rollback();
      throw new InternalServerError(`Rdbms query`);
    } finally {
      connection.release();
    }

    return results;
  }

  /**
   *
   * @param {{query: string, params: any[]}[]} sqls
   * @returns {Promise<any>}
   */
  async sendSelectQuerys(sqls) {
    let results = [];

    const connection = await this.getConnection();

    try {
      // 다중 sql
      for await (const sql of sqls) {
        let result = null;
        [result] = await connection.query(sql.query, sql?.params);
        results.push(result);
      }
    } catch (err) {
      logger.error(`Rdbms query: ${err}`);
      await connection.rollback();
      throw new InternalServerError(`Rdbms query`);
    } finally {
      connection.release();
    }

    return results;
  }

  async getConnection() {
    try {
      const connection = await this.pool.getConnection();

      return connection;
    } catch (err) {
      logger.error(`Rdbms Connect: ${err}`);
      throw new InternalServerError('Rdbms connect');
    }
  }

  /**
   *
   * @returns {string}
   */
  generateIdNumber() {
    return Math.random().toString().substring(2, 14);
  }
}

module.exports = { RdbmsRepository };
