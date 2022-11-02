const { Container } = require('../../src/loaders/Container.loader');
const { TestAuthRepository } = require('../repositories/auth.repository.test');
const { TestMemosRepository } = require('../repositories/memos.repository.test');
const { TestTasksRepository } = require('../repositories/tasks.repository.test');
const { TestUsersRepository } = require('../repositories/users.repository.test');

class TestContainer extends Container {
  getUsersRepository() {
    if (!this.usersRepository) {
      this.usersRepository = new TestUsersRepository();
    }

    return this.usersRepository;
  }

  getAuthRepository() {
    if (!this.authRepository) {
      this.authRepository = new TestAuthRepository();
    }

    return this.authRepository;
  }

  getMemosRepository() {
    if (!this.memosRepository) {
      this.memosRepository = new TestMemosRepository();
    }

    return this.memosRepository;
  }

  getTasksRepository() {
    if (!this.tasksRepository) {
      this.tasksRepository = new TestTasksRepository();
    }

    return this.tasksRepository;
  }
}

module.exports = { TestContainer };
