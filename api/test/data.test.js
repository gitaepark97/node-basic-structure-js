'use strict';

const users = [
  {
    id: 'US2022105105819',
    email: 'test1@email.com',
    password: '$2a$10$rdfXPs0pRGwIZIwjrRM7v.SHbeL6Bo.ACcLJkFgdGL.b/0culHloC',
    salt: '$2a$10$rdfXPs0pRGwIZIwjrRM7v.',
    name: null,
    create_date: new Date('2022-10-14T01:58:19.651Z'),
    update_date: new Date('2022-10-14T01:58:19.651Z'),
    delete_date: null,
    image_url: null,
    is_connect: 0,
  },
  {
    id: 'US2022105145438',
    email: 'test2@email.com',
    name: null,
    password: '$2a$10$1zUPiLLfjg5I0N2WZkhPfeeRc/jPyoverPvCk2vIRHOI19wh7flIe',
    salt: '$2a$10$1zUPiLLfjg5I0N2WZkhPfe',
    create_date: new Date('2022-10-14T05:54:38.720Z'),
    update_date: new Date('2022-10-14T05:54:38.720Z'),
    delete_date: new Date('2022-10-14T05:54:38.720Z'),
    image_url: null,
    is_connect: 1,
  },
  {
    id: 'US2022105142356',
    email: 'test3@email.com',
    name: null,
    password: '$2a$10$1zUPiLLfjg5I0N2WZkhPfeeRc/jPyoverPvCk2vIRHOI19wh7flIe',
    salt: '$2a$10$1zUPiLLfjg5I0N2WZkhPfe',
    create_date: new Date('2022-10-14T05:54:38.720Z'),
    update_date: new Date('2022-10-14T05:54:38.720Z'),
    delete_date: null,
    image_url: null,
    is_connect: 0,
  },
];

let refresh_tokens = [
  {
    user_id: 'US2022105145438',
    ip: '127.0.0.1',
    create_date: new Date('2022-10-14T01:58:19.651Z'),
    update_date: new Date('2022-10-14T01:58:19.651Z'),
    expire_date: new Date('2022-10-15T01:58:19.651Z'),
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NjU5NzA4MzZ9.6R2CzJ5JBOz5XbNK76sko_ZzFI1Uz_qaHZHV8utd1vg',
  },
  {
    user_id: 'US2022105142356',
    ip: '127.0.0.1',
    create_date: new Date('2022-10-14T01:58:19.651Z'),
    update_date: new Date('2022-10-14T01:58:19.651Z'),
    expire_date: new Date('2023-10-28T01:58:19.651Z'),
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NjU5NzA4MzZ9.6R2CzJ5JBOz5XbNK76sko_ZzFI1Uz_qaHZHV8utd1fk',
  },
];

const memos = [
  {
    user_id: 'US2022105105819',
    memo: 'test_memo1',
    create_date: new Date('2022-10-14T01:58:19.651Z'),
  },
  {
    user_id: 'US2022105105823',
    memo: 'test_memo2',
    create_date: new Date('2022-10-14T01:58:19.651Z'),
  },
];

const tasks = [
  {
    id: 'TK202210346421',
    user_id: 'US2022105105819',
    title: 'task1',
    is_done: 1,
    create_date: new Date('2022-10-19T04:06:20.421Z'),
    update_date: new Date('2022-10-19T04:57:22.699Z'),
  },
  {
    id: 'TK202210346432',
    user_id: 'US2022105145438',
    title: 'task1',
    is_done: 1,
    create_date: new Date('2022-10-19T04:06:20.421Z'),
    update_date: new Date('2022-10-19T04:57:22.699Z'),
  },
];

const deleteRefreshToken = id => {
  refresh_tokens = refresh_tokens.filter(refresh_token => refresh_token.user_id !== id);
};

module.exports = { users, refresh_tokens, memos, tasks, deleteRefreshToken };
