'use strict';

class InternalServerError extends Error {
  /**
   *
   * @param {any} message
   */
  constructor(message) {
    super(message);

    this.status = 500;
    this.name = 'Internal Server';
  }
}

module.exports = { InternalServerError };
