'use strict';

const supertest = require('supertest');
const { server } = require('../server.test');
const { login } = require('../dtos/auth.dto.test');
const { createMemo } = require('../dtos/memos.dto.test');
const { memos } = require('../data.test');

const request = supertest(server.server);

const config = {};

describe('Memos', () => {
  beforeAll(async () => {
    const { body } = await request.post('/api/auth/login').send(login.success);

    config.access_token = body.access_token;
  });

  describe('create memo', () => {
    it('success', async () => {
      const { statusCode } = await request
        .post('/api/memos')
        .set('authorization', `Bearer ${config.access_token}`)
        .send(createMemo.success);

      expect(statusCode).toBe(200);

      const memo = memos.filter(memo => memo.memo === createMemo.success.memo);

      expect(memo).toBeDefined();
    });

    it('memo must be a string', async () => {
      const { statusCode, body } = await request
        .post('/api/memos')
        .set('authorization', `Bearer ${config.access_token}`)
        .send(createMemo.invalidMemo);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('memo must be a string');
    });

    it('memo is required', async () => {
      const { statusCode, body } = await request
        .post('/api/memos')
        .set('authorization', `Bearer ${config.access_token}`)
        .send(createMemo.emptyMemo);

      expect(statusCode).toBe(400);

      expect(body.name).toBe('Bad Request');
      expect(body.message).toBe('memo is required');
    });
  });

  describe('get memos by user id', () => {
    it('success', async () => {
      const { statusCode, body } = await request
        .get('/api/memos')
        .set('authorization', `Bearer ${config.access_token}`);

      expect(statusCode).toBe(200);

      expect(body.memos).toBeDefined();
      body.memos.forEach(memo => {
        expect(memo.user_id).toBe('US2022105105819');
      });
    });
  });
});
