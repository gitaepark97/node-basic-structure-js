'use strict';

const { users } = require('../data.test');
const { register, login, reRegister, getNewTokens } = require('../dtos/auth.dto.test');
const { TestContainer } = require('../loaders/Conatiner.loader');

const testAuthService = new TestContainer().getAuthService();

describe('Auth Service', () => {
  describe('register', () => {
    it('success', async () => {
      await testAuthService.register(register.success);

      const newUser = users.filter(user => user.email === register.success.email)[0];

      expect(newUser.id).toBeDefined();
      expect(typeof newUser.id).toBe('string');
      expect(newUser.email).toBe(register.success.email);
      expect(newUser.password).toBeDefined();
      expect(typeof newUser.password).toBe('string');
      expect(newUser.salt).toBeDefined();
      expect(typeof newUser.salt).toBe('string');
      expect(newUser.name).toBeNull();
      expect(newUser.create_date).toBeDefined();
      expect(newUser.update_date).toBeDefined();
      expect(newUser.delete_date).toBeNull();
      expect(newUser.image_url).toBeNull();
      expect(newUser.is_connect).toBe(0);
    });

    it('email already used', async () => {
      await expect(async () => await testAuthService.register(register.usedEmail)).rejects.toThrowError();
    });
  });

  describe('login', () => {
    it('success', async () => {
      const { access_token, refresh_token } = await testAuthService.login(login.success, '127.0.0.1');

      expect(access_token).toBeDefined();
      expect(typeof access_token).toBe('string');
      expect(refresh_token).toBeDefined();
      expect(typeof refresh_token).toBe('string');
    });

    it('not found user', async () => {
      await expect(async () => await testAuthService.login(login.notFoundUser, '127.0.0.1')).rejects.toThrowError();
    });

    it('wrong password', async () => {
      await expect(async () => await testAuthService.login(login.wrongPassword, '127.0.0.1')).rejects.toThrowError();
    });

    it('user who has resigned', async () => {
      await expect(async () => await testAuthService.login(login.resignUser, '127.0.0.1')).rejects.toThrowError();
    });
  });

  describe('resign', () => {
    it('success', async () => {
      await testAuthService.resign('US2022105105819');

      const user = users.filter(user => user.id === 'US2022105105819')[0];

      expect(user.delete_date).toBeDefined();
    });

    it('user who has resigned', async () => {
      await expect(async () => await testAuthService.resign('US2022105145438')).rejects.toThrowError();
    });
  });

  describe('re-register', () => {
    it('success', async () => {
      await testAuthService.reRegister(reRegister.success);

      const user = users.filter(user => user.email === reRegister.success.email)[0];

      expect(user.delete_date).toBeNull();
    });

    it('user not found', async () => {
      await expect(async () => await testAuthService.reRegister(reRegister.notFoundUser)).rejects.toThrowError();
    });

    it('user already register', async () => {
      await expect(async () => await testAuthService.reRegister(reRegister.registerUser)).rejects.toThrowError();
    });
  });

  describe('get new token', () => {
    it('success', async () => {
      const { access_token, refresh_token } = await testAuthService.getNewTokens('127.0.0.1', getNewTokens.success);

      expect(access_token).toBeDefined();
      expect(typeof access_token).toBe('string');
      expect(refresh_token).toBeDefined();
      expect(typeof refresh_token).toBe('string');
    });

    it('refresh token invalid', async () => {
      await expect(
        async () => await testAuthService.getNewTokens('127.0.0.1', getNewTokens.invalidRefreshToken),
      ).rejects.toThrowError();
    });

    it('refresh token expired', async () => {
      await expect(
        async () => await testAuthService.getNewTokens('127.0.0.1', getNewTokens.expiredRefreshToken),
      ).rejects.toThrowError();
    });
  });

  describe('socket connect', () => {
    it('success', async () => {
      await testAuthService.socketConnect('US2022105142356');

      const user = users.filter(user => user.id === 'US2022105142356')[0];

      expect(user.is_connect).toBe(1);
    });

    it('user who has resigned', async () => {
      await expect(async () => await testAuthService.socketConnect('US2022105105819')).rejects.toThrowError();
    });
  });

  describe('socket disconnect', () => {
    it('success', async () => {
      await testAuthService.socketDisconnect('US2022105142356');

      const user = users.filter(user => user.id === 'US2022105142356')[0];

      expect(user.is_connect).toBe(0);
    });

    it('user who has resigned', async () => {
      await expect(async () => await testAuthService.socketDisconnect('US2022105105819')).rejects.toThrowError();
    });
  });
});
