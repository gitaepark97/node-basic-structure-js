'use strict';

const { Request, Response, NextFunction } = require('express');
const { InternalServerError } = require('../exceptions/InternalServer.exception');
const { logger } = require('../utils/logger.util');

/**
 * error logging 및 response 전달
 * @param {any} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
const errorInterceptor = (err, req, res, next) => {
  if (err) {
    const request = { user_id: req?.user?.user_id || null, params: req.params, query: req.query, body: req.body };

    // 비밀번호 삭제
    if (req.body?.password) {
      const { password, ...others } = req.body;

      request.body = others;
    }

    // custom error warn 처리
    if (['Bad Request', 'Forbidden', 'Not Found'].includes(err.name)) {
      logger.warn(`--------------- Warn ---------------`);
      logger.warn(`Method: ${req.method}`);
      logger.warn(`URL: ${req.originalUrl}`);
      logger.warn(`Request: ${JSON.stringify(request)}`);
      logger.warn(`Error: ${err}`);
      logger.warn('-------------------------------------');
    } else {
      logger.error(`--------------- Error ---------------`);
      logger.error(`Method: ${req.method}`);
      logger.error(`URL: ${req.originalUrl}`);
      logger.error(`Request: ${JSON.stringify(request)}`);
      logger.error(`Error: ${err}`);
      logger.error('-------------------------------------');

      err = new InternalServerError();
    }
  }

  return res.status(err.status).json({
    name: err.name,
    message: err.message,
  });
};

module.exports = { errorInterceptor };
