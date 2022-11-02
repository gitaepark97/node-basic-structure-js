'use strict';

const supertest = require('supertest');
const { login } = require('../dtos/auth.dto.test');
const { updateUser } = require('../dtos/users.dto.test');
const { server } = require('../server.test');
const { users } = require('../data.test');

const request = supertest(server.server);

const config = {};

describe('Users', () => {
  beforeAll(async () => {
    const { body } = await request.post('/api/auth/login').send(login.success);

    config.access_token = body.access_token;
  });

  describe('get users', () => {
    it('success', async () => {
      const { statusCode, body } = await request
        .get('/api/users')
        .set('authorization', `Bearer ${config.access_token}`);

      expect(statusCode).toBe(200);

      expect(body.users).toBeDefined();
      body.users.forEach(user => {
        expect(user.id).toBeDefined();
      });

      expect(body.count).toBeDefined();
      expect(typeof body.count).toBe('number');
      expect(body.count).toBe(body.users.length);
    });
  });

  describe('get user', () => {
    it('success', async () => {
      const { statusCode, body } = await request
        .get('/api/users/US2022105105819')
        .set('authorization', `Bearer ${config.access_token}`);

      expect(statusCode).toBe(200);

      expect(body.user).toBeDefined();
      expect(body.user.id).toBe('US2022105105819');
    });

    it('user not found', async () => {
      const { statusCode, body } = await request
        .get('/api/users/US2022105305819')
        .set('authorization', `Bearer ${config.access_token}`);

      expect(statusCode).toBe(404);

      expect(body.name).toBe('Not Found');
      expect(body.message).toBe('user');
    });
  });

  describe('update user', () => {
    it('success', async () => {
      const { statusCode } = await request
        .put('/api/users/US2022105105819')
        .set('authorization', `Bearer ${config.access_token}`)
        .send(updateUser.success);

      expect(statusCode).toBe(200);

      const user = users.filter(user => user.id === 'US2022105105819')[0];

      expect(user.name).toBe(updateUser.success.name);
    });

    it('success with file', async () => {
      const file = `${__dirname}/../assets/test.jpg`;

      const { statusCode } = await request
        .put('/api/users/US2022105105819')
        .set('authorization', `Bearer ${config.access_token}`)
        .attach('file', file);

      expect(statusCode).toBe(200);

      const user = users.filter(user => user.id === 'US2022105105819')[0];

      expect(user.image_url).toContain('test.jpg');
    });

    it('name must be a string', async () => {
      const { statusCode, body } = await request
        .put('/api/users/US2022105105819')
        .set('authorization', `Bearer ${config.access_token}`)
        .send(updateUser.invalidName);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('name must be a string');
    });

    it('only update your information', async () => {
      const { statusCode, body } = await request
        .put('/api/users/US2022105145438')
        .set('authorization', `Bearer ${config.access_token}`)
        .send(updateUser.success);

      expect(statusCode).toBe(403);

      expect(body.name).toBe('Forbidden');
      expect(body.message).toBe('only update your information');
    });

    it('user who has resigned', async () => {
      await request.delete('/api/auth').set('authorization', `Bearer ${config.access_token}`);

      const { statusCode, body } = await request
        .put('/api/users/US2022105105819')
        .set('authorization', `Bearer ${config.access_token}`)
        .send(updateUser.success);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('user who has resigned');
    });
  });
});
