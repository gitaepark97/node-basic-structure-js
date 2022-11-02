'use strict';

const { memos } = require('../data.test');

class TestMemosRepository {
  create(options) {
    const create_date = new Date();

    memos.push({ user_id: options.user_id, memo: options.memo, create_date });
  }

  findByUserId(user_id, options) {
    let results = [];

    const selectField = options?.select ? options.select.toString() : '*';

    const memo_list = memos.filter(memo => memo.user_id === user_id);

    if (selectField === '*') {
      results = memo_list;

      return results;
    }

    memo_list.forEach(memo => {
      const result = {};

      options.select.forEach(field => {
        result[field] = memo[field];
      });

      results.push(result);
    });

    return results;
  }
}

module.exports = { TestMemosRepository };
