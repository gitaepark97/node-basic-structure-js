'use strict';

class BadRequestError extends Error {
  /**
   *
   * @param {any} message
   */
  constructor(message) {
    super(message);

    this.status = 400;
    this.name = 'Bad Request';
  }
}

module.exports = { BadRequestError };
