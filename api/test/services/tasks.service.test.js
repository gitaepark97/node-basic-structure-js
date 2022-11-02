'use strict';

const { tasks } = require('../data.test');
const { createTasks, updateTask } = require('../dtos/tasks.dto.test');
const { TestContainer } = require('../loaders/Conatiner.loader');

const testTasksService = new TestContainer().getTasksService();

describe('Tasks Service', () => {
  describe('create tasks from array', () => {
    it('success', async () => {
      await testTasksService.createTasksFromArray('US2022105105819', createTasks.success);

      const task_list = tasks.filter(
        task => createTasks.success.titles.includes(task.title) && task.user_id === 'US2022105105819',
      );

      task_list.forEach(task => {
        expect(task.id).toBeDefined();
        expect(task.user_id).toBe('US2022105105819');
        expect(createTasks.success.titles).toContain(task.title);
        expect(task.is_done).toBe(0);
        expect(task.create_date).toBeDefined();
        expect(task.update_date).toBeDefined();
      });
    });
  });

  describe('get task by user id', () => {
    it('success', async () => {
      const { tasks } = await testTasksService.getTasksByUserId('US2022105105819');

      tasks.forEach(task => {
        expect(task.user_id).toBe('US2022105105819');
      });
    });
  });

  describe('get task by id', () => {
    it('success', async () => {
      const { task } = await testTasksService.getTaskById('US2022105105819', 'TK202210346421');

      expect(task.id).toBe('TK202210346421');
      expect(task.user_id).toBe('US2022105105819');
    });

    it('only show your tasks', async () => {
      await expect(
        async () => await testTasksService.getTaskById('US2022105145439', 'TK2332210346421'),
      ).rejects.toThrowError();
    });

    it('task not found', async () => {
      await expect(
        async () => await testTasksService.getTaskById('US2022105105819', 'TK2332210346331'),
      ).rejects.toThrowError();
    });
  });

  describe('update task', () => {
    it('success', async () => {
      await testTasksService.updateTask('US2022105105819', 'TK202210346421', updateTask.success);

      const task = tasks.filter(task => task.user_id === 'US2022105105819' && task.id === 'TK202210346421')[0];

      expect(task.is_done).toBe(updateTask.success.is_done);
    });

    it('task not found', async () => {
      await expect(
        async () => await testTasksService.updateTask('US2022105105819', 'TK2332210346331', updateTask.success),
      ).rejects.toThrowError();
    });
  });
});
