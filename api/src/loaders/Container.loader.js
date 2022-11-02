const { AuthRepository } = require('../repositories/auth.repository');
const { MemosRepository } = require('../repositories/memos.repository');
const { TasksRepository } = require('../repositories/tasks.repository');
const { UsersRepository } = require('../repositories/users.repository');
const { AuthService } = require('../services/auth.service');
const { MemosService } = require('../services/memos.service');
const { TasksService } = require('../services/tasks.service');
const { UsersService } = require('../services/users.service');

class Container {
  getUsersRepository() {
    if (!this.usersRepository) {
      this.usersRepository = new UsersRepository();
    }

    return this.usersRepository;
  }

  getAuthRepository() {
    if (!this.authRepository) {
      this.authRepository = new AuthRepository();
    }

    return this.authRepository;
  }

  getMemosRepository() {
    if (!this.memosRepository) {
      this.memosRepository = new MemosRepository();
    }

    return this.memosRepository;
  }

  getTasksRepository() {
    if (!this.tasksRepository) {
      this.tasksRepository = new TasksRepository();
    }

    return this.tasksRepository;
  }

  getUsersService() {
    if (!this.usersService) {
      this.usersService = new UsersService(this.getUsersRepository());
    }

    return this.usersService;
  }

  getAuthService() {
    if (!this.authService) {
      this.authService = new AuthService(this.getAuthRepository(), this.getUsersService());
    }

    return this.authService;
  }

  getMemosService() {
    if (!this.memosService) {
      this.memosService = new MemosService(this.getMemosRepository(), this.getUsersService());
    }

    return this.memosService;
  }

  getTasksService() {
    if (!this.tasksService) {
      this.tasksService = new TasksService(this.getTasksRepository(), this.getUsersService());
    }

    return this.tasksService;
  }
}

module.exports = { Container };
