'use strict';

const { TestRdbmsRepository } = require('./base/rdbms.repository.test');
const { NotFoundError } = require('../../src/exceptions/NotFound.exception');
const { tasks, users } = require('../data.test');

class TestTasksRepository extends TestRdbmsRepository {
  async createFromArray(options) {
    for await (const title of options.titles) {
      const id = 'TK' + this.generateIdNumber();
      const create_date = new Date();

      tasks.push({
        id: id,
        user_id: options.user_id,
        title,
        is_done: 0,
        create_date,
        update_date: create_date,
      });
    }
  }

  async findByUserIdAndCount(user_id, options = null) {
    let results = [];

    const selectField = options?.select ? options.select.toString() : 'TASKS.*';

    const task_list = tasks.filter(
      task => task.user_id === user_id && !users.filter(user => user.id === user_id)[0].delete_date,
    );

    if (selectField === 'TASKS.*') {
      results = task_list;

      return [results, results.length];
    }

    task_list.forEach(task => {
      const result = {};

      options.select.forEach(field => {
        result[field.split('.')[1]] = task[field.split('.')[1]];
      });

      results.push(result);
    });

    return [results, results.length];
  }

  async findById(id, options = null) {
    let result = {};

    const selectField = options?.select ? options.select.toString() : 'TASKS.*';

    const task = tasks.filter(task => task.id === id)[0];
    if (!task) throw new NotFoundError('task');

    if (selectField === 'TASKS.*') {
      result = task;

      return result;
    }

    options.select.forEach(field => {
      result[field.split('.')[1]] = task[field.split('.')[1]];
    });

    return result;
  }

  update(options) {
    const update_date = new Date();

    const existTask = tasks.filter(task => task.id === options.id)[0];

    options?.title && (existTask.title = options.title);
    (options?.is_done === 1 || options?.is_done === 0) && (existTask.is_done = options.is_done);
    existTask.update_date = update_date;
  }
}

module.exports = { TestTasksRepository };
