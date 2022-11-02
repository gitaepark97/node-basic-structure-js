'use strict';

const { memos } = require('../data.test');
const { createMemo } = require('../dtos/memos.dto.test');
const { TestContainer } = require('../loaders/Conatiner.loader');

const testMemosService = new TestContainer().getMemosService();

describe('Memos Service', () => {
  describe('create memo', () => {
    it('success', async () => {
      await testMemosService.createMemo('US2022105105819', createMemo.success);

      const newMemo = memos.filter(
        memo => memo.memo === createMemo.success.memo && memo.user_id === 'US2022105105819',
      )[0];

      expect(newMemo.create_date).toBeDefined();
    });
  });

  describe('get memos by user id', () => {
    it('success', async () => {
      const { memos } = await testMemosService.getMemosByUserId('US2022105105819');

      memos.forEach(memo => {
        expect(memo.user_id).toBe('US2022105105819');
        expect(memo.create_date).toBeDefined();
        expect(memo.memo).toBeDefined();
      });
    });
  });
});
