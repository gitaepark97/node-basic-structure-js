'use strict';

const { CreateTasksDto } = require('../dtos/tasks.dto');
const { UpdateTaskDto } = require('../dtos/tasks.dto');
const { ForbiddenError } = require('../exceptions/Forbidden.exception');
const { TasksRepository } = require('../repositories/tasks.repository');
const { UsersService } = require('./users.service');

class TasksService {
  /**
   * @param {TasksRepository} tasksRepository // 의존성 주입
   * @param {UsersService} usersService // 의존성 주입
   */
  constructor(tasksRepository, usersService) {
    this.tasksRepository = tasksRepository;
    this.usersService = usersService;
  }

  /**
   * 다중 업무 생성
   * @param {string} user_id
   * @param {CreateTasksDto} createTasksDto
   */
  async createTasksFromArray(user_id, createTasksDto) {
    const user = await this.usersService.getNotDeleteUserById(user_id);

    await this.tasksRepository.createFromArray({ user_id: user.id, ...createTasksDto });
  }

  /**
   * 회원별 업무 목록 조회
   * @returns {Promise<{tasks: any[], count: number}>}
   */
  async getTasksByUserId(user_id) {
    const user = await this.usersService.getNotDeleteUserById(user_id);

    const [tasks, count] = await this.tasksRepository.findByUserIdAndCount(user.id);

    return { tasks, count };
  }

  /**
   * id별 업무 조회
   * @param {string} user_id
   * @returns {Promise<{tasks: any[]}>}
   */
  async getTaskById(user_id, id) {
    const user = await this.usersService.getNotDeleteUserById(user_id);

    const task = await this.tasksRepository.findById(id);
    // 조회 권한 검증
    if (task.user_id !== user.id) {
      throw new ForbiddenError('only show your tasks');
    }

    return { task };
  }
  /**
   * 업무 수정
   * @param {string} user_id
   * @param {UpdateTaskDto} updateTaskDto
   */
  async updateTask(user_id, id, updateTaskDto) {
    const user = await this.usersService.getNotDeleteUserById(user_id);

    const task = await this.tasksRepository.findById(id, { select: ['TASKS.id', 'TASKS.user_id'] });
    // 수정 권한 검증
    if (task.user_id !== user.id) {
      throw new ForbiddenError('only update your tasks');
    }

    await this.tasksRepository.update({ ...task, ...updateTaskDto });
  }
}

module.exports = { TasksService };
