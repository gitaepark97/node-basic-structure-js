'use strict';

const { logger } = require('../utils/logger.util');

/**
 * local, development 시 response logging
 * @param {any} socket
 * @param {any} client
 * @param {any} data
 * @returns {any}
 */
const responseSocketInterceptor = (socket, client, data) => {
  const response = data ?? null;

  logger.debug(`--------------- Debug ---------------`);
  logger.debug(`Socket: ${JSON.stringify(socket.handshake.query)}`);
  logger.debug(`Client: ${JSON.stringify(client)}`);
  logger.debug(`Response: ${JSON.stringify(response)}`);
  logger.debug('-------------------------------------');

  return data;
};

/**
 *
 * @param {string} key
 * @param {any} data
 * @returns {any}
 */
const debugKafkaInterceptor = (key, data) => {
  const response = data ?? null;

  logger.debug(`--------------- Debug ---------------`);
  logger.debug(`Kafka key: ${JSON.stringify(key)}`);
  logger.debug(`Response: ${JSON.stringify(response)}`);
  logger.debug('-------------------------------------');

  return data;
};

module.exports = { responseSocketInterceptor, debugKafkaInterceptor };
