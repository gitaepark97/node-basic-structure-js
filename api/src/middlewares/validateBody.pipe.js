'use strict';

const { ObjectSchema } = require('joi');
const { Request, Response, NextFunction } = require('express');

/**
 * request 검증
 * @param {ObjectSchema<any>} schema
 * @returns {validateFunction}
 */
const validateBody =
  schema =>
  /**
   * @callback validateFunction
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<void | Response>}
   */
  async (req, res, next) => {
    const body = req.body;

    try {
      await schema.validateAsync(body);

      return next();
    } catch (err) {
      const message = err.details[0].message.replace(/"/g, '');

      return res.status(400).json({ name: 'Bad Request', message });
    }
  };

module.exports = { validateBody };
