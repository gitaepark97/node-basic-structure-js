'use strict';

const cassandra = require('cassandra-driver');
const { config } = require('../../config');
const { InternalServerError } = require('../../exceptions/InternalServer.exception');
const { logger } = require('../../utils/logger.util');

class NosqlRepository {
  /**
   *
   * @param {{query: string, params: any[]}[]} cqls
   * @returns {Promise<any>}
   */
  async sendQuerys(cqls) {
    let results = [];
    let client = null;

    try {
      client = new cassandra.Client(config.nosql);
    } catch (err) {
      logger.error(`Nosql Connect: ${err}`);
      throw new InternalServerError('Nosql connect');
    }

    try {
      // 다중 cql
      for await (const cql of cqls) {
        let result = null;
        result = (await client.execute(cql.query, cql?.params))?.rows;
        results.push(result);
      }
    } catch (err) {
      logger.error(`Nosql query: ${err}`);
      throw new InternalServerError('Nosql query');
    }

    return results;
  }
}

module.exports = { NosqlRepository };
