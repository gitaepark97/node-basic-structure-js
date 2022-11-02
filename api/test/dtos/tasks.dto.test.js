'use strict';

const createTasks = {
  success: {
    titles: ['task2', 'task3'],
  },
  invalidTitles: {
    titles: 'taks2, task3',
  },
  emptyTitles: {},
};

const updateTask = {
  success: {
    title: 'test_task1',
    is_done: 0,
  },
  invalidIsDone: {
    is_done: 'done',
  },
  invalidtitle: {
    title: 1,
  },
};

module.exports = { createTasks, updateTask };
