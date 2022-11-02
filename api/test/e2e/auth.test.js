'use strict';

const supertest = require('supertest');
const { server } = require('../server.test');
const { register, login, reRegister, getNewTokens } = require('../dtos/auth.dto.test');
const { users } = require('../data.test');

const request = supertest(server.server);

const config = {};

describe('Auth', () => {
  describe('register', () => {
    it('success', async () => {
      const { statusCode } = await request.post('/api/auth/register').send(register.success);

      expect(statusCode).toBe(200);

      const user = users.filter(user => user.email === register.success.email)[0];

      expect(user).toBeDefined();
    });

    it('email already used', async () => {
      const { statusCode, body } = await request.post('/api/auth/register').send(register.usedEmail);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('email already used');
    });

    it('password length must be at least 6 characters long', async () => {
      const { statusCode, body } = await request.post('/api/auth/register').send(register.shortPassword);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('password length must be at least 6 characters long');
    });

    it('password length must be less than or equal to 18 characters long', async () => {
      const { statusCode, body } = await request.post('/api/auth/register').send(register.longPassword);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('password length must be less than or equal to 18 characters long');
    });

    it('password is required', async () => {
      const { statusCode, body } = await request.post('/api/auth/register').send(register.emptyPassword);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('password is required');
    });

    it('email must be a valid email', async () => {
      const { statusCode, body } = await request.post('/api/auth/register').send(register.invalidEmail);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('email must be a valid email');
    });

    it('email is required', async () => {
      const { statusCode, body } = await request.post('/api/auth/register').send(register.emptyEmail);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('email is required');
    });
  });

  describe('login', () => {
    it('success', async () => {
      const { statusCode, body } = await request.post('/api/auth/login').send(login.success);

      expect(statusCode).toBe(200);

      expect(body.access_token).toBeDefined();
      expect(typeof body.access_token).toBe('string');
      expect(body.refresh_token).toBeDefined();
      expect(typeof body.refresh_token).toBe('string');

      config.access_token = body.access_token;
      config.refresh_token = body.refresh_token;
    });

    it('not found user', async () => {
      const { statusCode, body } = await request.post('/api/auth/login').send(login.notFoundUser);

      expect(statusCode).toBe(404);

      expect(body.name).toBe('Not Found');
      expect(body.message).toBe('user');
    });

    it('wrong password', async () => {
      const { statusCode, body } = await request.post('/api/auth/login').send(login.wrongPassword);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('wrong password');
    });

    it('user who has resigned', async () => {
      const { statusCode, body } = await request.post('/api/auth/login').send(login.resignUser);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('user who has resigned');
    });

    it('email must be a valid email', async () => {
      const { statusCode, body } = await request.post('/api/auth/login').send(login.invalidEmail);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('email must be a valid email');
    });

    it('email is required', async () => {
      const { statusCode, body } = await request.post('/api/auth/login').send(login.emptyEmail);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('email is required');
    });

    it('password must be a string', async () => {
      const { statusCode, body } = await request.post('/api/auth/login').send(login.invalidPassword);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('password must be a string');
    });

    it('password is required', async () => {
      const { statusCode, body } = await request.post('/api/auth/login').send(login.emptyPassword);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('password is required');
    });
  });

  describe('resign', () => {
    it('success', async () => {
      const { statusCode } = await request.delete('/api/auth').set('authorization', `Bearer ${config.access_token}`);

      expect(statusCode).toBe(200);

      const user = users.filter(user => user.id === 'US2022105105819')[0];

      expect(user.delete_date).not.toBeNull();
    });

    it('user who has resigned', async () => {
      const { statusCode, body } = await request
        .delete('/api/auth')
        .set('authorization', `Bearer ${config.access_token}`);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('user who has resigned');
    });

    it('access token empty', async () => {
      const { statusCode, body } = await request.delete('/api/auth').set('authorization', `Bearer `);

      expect(statusCode).toBe(401);

      expect(body.name).toBe('Unauthorized');
      expect(body.message).toBe('access token empty');
    });

    it('access token expired', async () => {
      const { statusCode, body } = await request
        .delete('/api/auth')
        .set(
          'authorization',
          `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiVVMyMDIyMTAxNzMwMiIsImlhdCI6MTY2NjA1MzI0MiwiZXhwIjoxNjY2MTM5NjQyfQ.3-J-X-Bluq0HFJSaU2dgTG6kXputZyzWLH5_QnH83y0`,
        );

      expect(statusCode).toBe(401);

      expect(body.name).toBe('Unauthorized');
      expect(body.message).toBe('access token expired');
    });

    it('access token invalid', async () => {
      const { statusCode, body } = await request.delete('/api/auth').set('authorization', `Bearer 12jedlskfass`);

      expect(statusCode).toBe(401);

      expect(body.name).toBe('Unauthorized');
      expect(body.message).toBe('access token invalid');
    });
  });

  describe('re-register', () => {
    it('success', async () => {
      const { statusCode } = await request.post('/api/auth/re-register').send(reRegister.success);

      expect(statusCode).toBe(200);

      const user = users.filter(user => user.id === 'US2022105145438')[0];

      expect(user.delete_date).toBeNull();
    });

    it('user not found', async () => {
      const { statusCode, body } = await request.post('/api/auth/re-register').send(reRegister.notFoundUser);

      expect(statusCode).toBe(404);

      expect(body.name).toBe('Not Found');
      expect(body.message).toBe('user');
    });

    it('user already register', async () => {
      const { statusCode, body } = await request.post('/api/auth/re-register').send(reRegister.registerUser);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('user already register');
    });

    it('email must be a valid email', async () => {
      const { statusCode, body } = await request.post('/api/auth/re-register').send(reRegister.invalidEmail);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('email must be a valid email');
    });

    it('email is required', async () => {
      const { statusCode, body } = await request.post('/api/auth/re-register').send(reRegister.emptyEmail);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('email is required');
    });
  });

  describe('get new tokens', () => {
    it('success', async () => {
      const { statusCode, body } = await request.post('/api/auth/tokens').send(getNewTokens.success);

      expect(statusCode).toBe(200);

      expect(body.access_token).toBeDefined();
      expect(typeof body.access_token).toBe('string');
      expect(body.refresh_token).toBeDefined();
      expect(typeof body.refresh_token).toBe('string');

      config.new_access_token = body.access_token;
    });

    it('wrong refresh_token or ip', async () => {
      const { statusCode, body } = await request.post('/api/auth/tokens').send(getNewTokens.wrongRefreshToken);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('wrong refresh_token or ip');
    });

    it('refresh token expired', async () => {
      const { statusCode, body } = await request.post('/api/auth/tokens').send(getNewTokens.expiredRefreshToken);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('refresh token expired');
    });

    it('refresh_token must be a string', async () => {
      const { statusCode, body } = await request.post('/api/auth/tokens').send(getNewTokens.invalidRefreshToken);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('refresh_token must be a string');
    });

    it('refresh_token is required', async () => {
      const { statusCode, body } = await request.post('/api/auth/tokens').send(getNewTokens.emptyRefreshToken);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('refresh_token is required');
    });
  });

  describe('connect socket', () => {
    it('success', async () => {
      const { statusCode } = await request
        .post('/api/auth/connect/US2022105142356')
        .set('authorization', `Bearer ${config.new_access_token}`);

      expect(statusCode).toBe(200);

      const user = users.filter(user => user.id === 'US2022105142356')[0];

      expect(user.is_connect).toBe(1);
    });

    it('user who has resigned', async () => {
      const { statusCode, body } = await request
        .post('/api/auth/connect/US2022105105819')
        .set('authorization', `Bearer ${config.access_token}`);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('user who has resigned');
    });
  });

  describe('disconnect socket', () => {
    it('success', async () => {
      const { statusCode } = await request
        .delete('/api/auth/connect/US2022105142356')
        .set('authorization', `Bearer ${config.new_access_token}`);

      expect(statusCode).toBe(200);

      const user = users.filter(user => user.id === 'US2022105142356')[0];

      expect(user.is_connect).toBe(0);
    });

    it('user who has resigned', async () => {
      const { statusCode, body } = await request
        .delete('/api/auth/connect/US2022105105819')
        .set('authorization', `Bearer ${config.access_token}`);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('user who has resigned');
    });
  });
});
