'use strict';

const { NotFoundError } = require('../../src/exceptions/NotFound.exception');
const { users, deleteRefreshToken } = require('../data.test');
const { TestRdbmsRepository } = require('./base/rdbms.repository.test');

class TestUsersRepository extends TestRdbmsRepository {
  create(options) {
    const id = 'US' + this.generateIdNumber();
    const create_date = new Date();

    users.push({
      id: id,
      ...options,
      create_date,
      update_date: create_date,
      name: null,
      delete_date: null,
      image_url: null,
      is_connect: 0,
    });
  }

  update(options) {
    const update_date = new Date();

    const existUser = users.filter(user => user.id === options.id)[0];

    options?.password && (existUser.password = options.password);
    options?.name && (existUser.name = options.name);
    existUser.delete_date = options?.delete_date || null;
    options?.image_url && (existUser.image_url = options.image_url);
    options?.salt && (existUser.salt = options.salt);
    (options?.is_connect === 1 || options?.is_connect === 0) && (existUser.is_connect = options.is_connect);
    existUser.update_date = update_date;
  }

  async softDeleteById(id) {
    const delete_date = new Date();

    const existUser = users.filter(user => user.id === id)[0];

    existUser.delete_date = delete_date;
    deleteRefreshToken(id);
  }

  async findAndCount(options) {
    let results = [];

    const selectField = options?.select
      ? options.select.toString()
      : 'USERS.id, USERS.email, USERS.name, USERS.create_date, USERS.update_date, USERS.delete_date, USERS.image_url, USERS.is_connect';

    const user_list = users.filter(user => !user.delete_date);

    if (
      selectField ===
      'USERS.id, USERS.email, USERS.name, USERS.create_date, USERS.update_date, USERS.delete_date, USERS.image_url, USERS.is_connect'
    ) {
      results = user_list;

      return [results, results.length];
    }

    user_list.forEach(user => {
      const result = {};

      options.select.forEach(field => {
        result[field.split('.')[1]] = user[field.split('.')[1]];
      });

      results.push(result);
    });

    return [results, results.length];
  }

  async findById(id, options) {
    let result = {};

    const selectField = options?.select
      ? options.select.toString()
      : 'USERS.id, USERS.email, USERS.name, USERS.create_date, USERS.update_date, USERS.delete_date, USERS.image_url, USERS.is_connect';

    const user = users.filter(user => user.id === id)[0];
    if (!user) throw new NotFoundError('user');

    if (
      selectField ===
      'USERS.id, USERS.email, USERS.name, USERS.create_date, USERS.update_date, USERS.delete_date, USERS.image_url, USERS.is_connect'
    ) {
      result = user;

      return result;
    }

    options.select.forEach(field => {
      result[field.split('.')[1]] = user[field.split('.')[1]];
    });

    return result;
  }

  async findByEmail(email, options) {
    let result = {};

    const selectField = options?.select ? options.select.toString() : 'USERS.*';

    const user = users.filter(user => user.email === email)[0];

    if (selectField === 'USERS.*' || !user) {
      result = user;

      return result;
    }

    options.select.forEach(field => {
      result[field.split('.')[1]] = user[field.split('.')[1]];
    });

    return result;
  }
}

module.exports = { TestUsersRepository };
