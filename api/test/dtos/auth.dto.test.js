'use strict';

const register = {
  success: {
    email: 'test4@email.com',
    password: '111111',
  },
  usedEmail: {
    email: 'test1@email.com',
    password: '111111',
  },
  shortPassword: {
    email: 'test2@email.com',
    password: '1111',
  },
  longPassword: {
    email: 'test2@email.com',
    password: '11111111111111111111',
  },
  emptyPassword: {
    email: 'test1@email.com',
  },
  invalidEmail: {
    email: 'test2',
    password: '111111',
  },
  emptyEmail: {
    password: '111111',
  },
};

const login = {
  success: {
    email: 'test1@email.com',
    password: '111111',
  },
  notFoundUser: {
    email: 'test10@email.com',
    password: '111111',
  },
  wrongPassword: {
    email: 'test1@email.com',
    password: '111112',
  },
  resignUser: {
    email: 'test2@email.com',
    password: '111111',
  },
  invalidEmail: {
    email: 'test1',
    password: '111112',
  },
  emptyEmail: {
    password: '111112',
  },
  invalidPassword: {
    email: 'test1@email.com',
    password: 111111,
  },
  emptyPassword: {
    email: 'test1@email.com',
  },
};

const reRegister = {
  success: {
    email: 'test2@email.com',
  },
  notFoundUser: {
    email: 'test10@email.com',
  },
  registerUser: {
    email: 'test3@email.com',
  },
  invalidEmail: {
    email: 'test1',
    password: '111112',
  },
  emptyEmail: {
    password: '111112',
  },
};

const getNewTokens = {
  success: {
    refresh_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NjU5NzA4MzZ9.6R2CzJ5JBOz5XbNK76sko_ZzFI1Uz_qaHZHV8utd1fk',
  },
  wrongRefreshToken: {
    refresh_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NjU5NzA4MzZ9.6R2CzJ5JBOz5XbNK76sko_ZzFI1Uz_qaHZHV8utdsdk',
  },
  expiredRefreshToken: {
    refresh_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NjU5NzA4MzZ9.6R2CzJ5JBOz5XbNK76sko_ZzFI1Uz_qaHZHV8utd1vg',
  },
  invalidRefreshToken: {
    refresh_token: 11111,
  },
  emptyRefreshToken: {},
};

module.exports = {
  register,
  login,
  reRegister,
  getNewTokens,
};
