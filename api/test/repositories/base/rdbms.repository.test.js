'use strict';

class TestRdbmsRepository {
  generateIdNumber() {
    return Math.random().toString().substring(2, 14);
  }
}

module.exports = { TestRdbmsRepository };
