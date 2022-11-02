'use strict';

const { logger } = require('../utils/logger.util');

/**
 * error logging 및 response 전달
 * @param {any} err
 * @param {any} socket
 * @param {any} client
 */
const errorInterceptor = (err, socket, client) => {
  let error = null;

  // custom error warn 처리
  if (err.name === 'Bad Request') {
    logger.warn(`--------------- Warn ---------------`);
    logger.warn(`Socket: ${JSON.stringify(socket.handshake.query)}`);
    logger.warn(`Client: ${JSON.stringify(client)}`);
    logger.warn(`Error: ${err}`);
    logger.warn('-------------------------------------');
  } else {
    logger.error(`--------------- Error ---------------`);
    logger.error(`Socket: ${JSON.stringify(socket.handshake.query)}`);
    logger.error(`Client: ${JSON.stringify(client)}`);
    logger.error(`Error: ${err}`);
    logger.error('-------------------------------------');

    if (err.name === 'AxiosError') {
      error = err.response.data;
    } else {
      error = { name: err.name, message: err.message };
    }
  }

  return error;
};

module.exports = { errorInterceptor };
