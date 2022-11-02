'use strict';

const supertest = require('supertest');
const { tasks } = require('../data.test');
const { login } = require('../dtos/auth.dto.test');
const { createTasks, updateTask } = require('../dtos/tasks.dto.test');
const { server } = require('../server.test');

const request = supertest(server.server);

const config = {};

describe('Tasks', () => {
  beforeAll(async () => {
    const { body } = await request.post('/api/auth/login').send(login.success);

    config.access_token = body.access_token;
  });

  describe('create tasks', () => {
    it('success', async () => {
      const { statusCode } = await request
        .post('/api/tasks')
        .set('authorization', `Bearer ${config.access_token}`)
        .send(createTasks.success);

      expect(statusCode).toBe(200);
    });

    it('titles must be an array', async () => {
      const { statusCode, body } = await request
        .post('/api/tasks')
        .set('authorization', `Bearer ${config.access_token}`)
        .send(createTasks.invalidTitles);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('titles must be an array');
    });

    it('titles is required', async () => {
      const { statusCode, body } = await request
        .post('/api/tasks')
        .set('authorization', `Bearer ${config.access_token}`)
        .send(createTasks.emptyTitles);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('titles is required');
    });
  });

  describe('get task by user id', () => {
    it('success', async () => {
      const { statusCode, body } = await request
        .get('/api/tasks')
        .set('authorization', `Bearer ${config.access_token}`);

      expect(statusCode).toBe(200);

      expect(body.tasks).toBeDefined();
      body.tasks.forEach(task => {
        expect(task.user_id).toBe('US2022105105819');
      });
    });
  });

  describe('get task', () => {
    it('success', async () => {
      const { statusCode, body } = await request
        .get('/api/tasks/TK202210346421')
        .set('authorization', `Bearer ${config.access_token}`);

      expect(statusCode).toBe(200);

      expect(body.task).toBeDefined();
      expect(body.task.id).toBe('TK202210346421');
    });

    it('only show your tasks', async () => {
      const { statusCode, body } = await request
        .get('/api/tasks/TK202210346432')
        .set('authorization', `Bearer ${config.access_token}`);

      expect(statusCode).toBe(403);

      expect(body.name).toBe('Forbidden');
      expect(body.message).toBe('only show your tasks');
    });

    it('task not found', async () => {
      const { statusCode, body } = await request
        .get('/api/tasks/TK202210346433')
        .set('authorization', `Bearer ${config.access_token}`);

      expect(statusCode).toBe(404);

      expect(body.name).toBe('Not Found');
      expect(body.message).toBe('task');
    });
  });

  describe('update task', () => {
    it('success', async () => {
      const { statusCode } = await request
        .put('/api/tasks/TK202210346421')
        .set('authorization', `Bearer ${config.access_token}`)
        .send(updateTask.success);

      expect(statusCode).toBe(200);

      const task = tasks.filter(task => task.id === 'TK202210346421')[0];

      expect(task.title).toBe(updateTask.success.title);
      expect(task.is_done).toBe(updateTask.success.is_done);
    });

    it('only update your tasks', async () => {
      const { statusCode, body } = await request
        .put('/api/tasks/TK202210346432')
        .set('authorization', `Bearer ${config.access_token}`)
        .send(updateTask.success);

      expect(statusCode).toBe(403);

      expect(body.name).toBe('Forbidden');
      expect(body.message).toBe('only update your tasks');
    });

    it('title must be a string', async () => {
      const { statusCode, body } = await request
        .put('/api/tasks/TK202210346421')
        .set('authorization', `Bearer ${config.access_token}`)
        .send(updateTask.invalidtitle);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('title must be a string');
    });

    it('is_done must be a number', async () => {
      const { statusCode, body } = await request
        .put('/api/tasks/TK202210346421')
        .set('authorization', `Bearer ${config.access_token}`)
        .send(updateTask.invalidIsDone);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('is_done must be a number');
    });
  });
});
