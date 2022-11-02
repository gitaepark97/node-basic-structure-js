'use strict';

const { logger } = require('../utils/logger.util');

/**
 * development 시 response logging
 * @param {any} socket
 * @param {any} client
 * @param {any} data
 * @returns {any}
 */
const responseSocketInterceptor = (socket, client, data) => {
  const response = data ?? null;

  logger.http(`--------------- Response ---------------`);
  logger.http(`Socket: ${JSON.stringify(socket.handshake.query)}`);
  logger.http(`Client: ${JSON.stringify(client)}`);
  logger.http(`Response: ${JSON.stringify(response)}`);
  logger.http('----------------------------------------');

  return data;
};

/**
 * development 시 response logging
 * @param {string} key
 * @param {any} data
 * @returns {any}
 */
const responseKafkaInterceptor = (key, data) => {
  const response = data ?? null;

  logger.http(`--------------- Response ---------------`);
  logger.http(`Kafka key: ${JSON.stringify(key)}`);
  logger.http(`Response: ${JSON.stringify(response)}`);
  logger.http('----------------------------------------');

  return data;
};

module.exports = { responseSocketInterceptor, responseKafkaInterceptor };
