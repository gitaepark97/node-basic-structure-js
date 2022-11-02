'use strict';

const { users } = require('../data.test');
const { updateUser } = require('../dtos/users.dto.test');
const { TestContainer } = require('../loaders/Conatiner.loader');

const testUsersService = new TestContainer().getUsersService();

describe('Users Service', () => {
  describe('get users', () => {
    it('success', async () => {
      const { users, count } = await testUsersService.getUsers();

      users.forEach(user => {
        expect(user.id).toBeDefined();
        expect(user.delete_date).toBeNull();
      });

      expect(count).toBe(users.length);
    });
  });

  describe('get user', () => {
    it('success', async () => {
      const { user } = await testUsersService.getUserById('US2022105105819');

      expect(user.id).toBe('US2022105105819');
    });

    it('user not found', async () => {
      await expect(async () => await testUsersService.getUserById('US2022105305819')).rejects.toThrowError();
    });
  });

  describe('update user', () => {
    it('success', async () => {
      await testUsersService.updateUser('US2022105105819', updateUser.success);

      const user = users.filter(user => user.id === 'US2022105105819')[0];

      expect(user.name).toBe(updateUser.success.name);
    });

    it('user who has resigned', async () => {
      await expect(
        async () => await testUsersService.updateUser('US2022105145438', updateUser.success),
      ).rejects.toThrowError();
    });
  });
});
