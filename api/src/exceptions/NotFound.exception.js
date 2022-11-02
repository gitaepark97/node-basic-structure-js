'use strict';

class NotFoundError extends Error {
  /**
   *
   * @param {any} message
   */
  constructor(message) {
    super(message);

    this.status = 404;
    this.name = 'Not Found';
  }
}

module.exports = { NotFoundError };
