'use strict';

const { ObjectSchema } = require('joi');
const { BadRequestError } = require('../exceptions/BadRequest.exception');

/**
 * socket data 검증
 * @param {ObjectSchema<any>} schema
 * @param {any} socket
 * @param {any} client
 */
const validateSocket = async (schema, socket, client) => {
  try {
    await schema.validateAsync({ socket, client });
  } catch (err) {
    const message = err.details[0].message.replace(/"/g, '');

    throw new BadRequestError(message);
  }
};

module.exports = { validateSocket };
