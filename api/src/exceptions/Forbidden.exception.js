'use strict';

class ForbiddenError extends Error {
  /**
   *
   * @param {any} message
   */
  constructor(message) {
    super(message);

    this.status = 403;
    this.name = 'Forbidden';
  }
}

module.exports = { ForbiddenError };
