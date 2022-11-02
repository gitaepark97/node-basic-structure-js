'use strict';

const { Request } = require('express');
const { logger } = require('../utils/logger.util');

/**
 * development 시 response logging
 * @param {Request} req
 * @param {any} result
 * @returns {any}
 */
const responseInterceptor = (req, result) => {
  const request = { user_id: req?.user?.user_id || null, params: req.params, query: req.query, body: req.body };
  const response = result ?? null;

  // 비밀번호 삭제
  if (req.body?.password) {
    const { password, ...others } = req.body;

    request.body = others;
  }

  logger.http(`--------------- Response ---------------`);
  logger.http(`Method: ${req.method}`);
  logger.http(`URL: ${req.originalUrl}`);
  logger.http(`Request: ${JSON.stringify(request)}`);
  logger.http(`Response: ${JSON.stringify(response)}`);
  logger.http('----------------------------------------');

  return result;
};

module.exports = { responseInterceptor };
