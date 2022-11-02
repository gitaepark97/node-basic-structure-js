'use strict';

const { BadRequestError } = require('../exceptions/BadRequest.exception');
const { NotFoundError } = require('../exceptions/NotFound.exception');
const { AuthRepository } = require('../repositories/auth.repository');
const { generateSalt, validatePassword, generateHashPassword } = require('../utils/password.util');
const { generateAccessToken, generateRefreshToken } = require('../utils/token.util');
const { UsersService } = require('./users.service');

class AuthService {
  /**
   * @param {AuthRepository} authRepository // 의존성 주입
   * @param {UsersService} usersService // 의존성 주입
   */
  constructor(authRepository, usersService) {
    this.authRepository = authRepository;
    this.usersService = usersService;
  }

  /**
   * 회원가입
   * @param {{email: string, password: string}} registerDto
   */
  async register(registerDto) {
    const user = await this.usersService.getUserByEmail(registerDto.email);
    // email 중복 검증
    if (user) {
      throw new BadRequestError('email already used');
    }

    const salt = await generateSalt();
    const hash_password = await generateHashPassword(registerDto.password, salt);

    await this.usersService.createUser(registerDto.email, hash_password, salt);
  }

  /**
   * 로그인
   * @param {{email: string, password: string}} loginDto
   * @param {string} ip
   * @returns {Promise<{access_token: string, refresh_token: string}>}
   */
  async login(loginDto, ip) {
    const user = await this.usersService.getUserByEmail(loginDto.email);
    // 회원 검증
    if (!user) {
      throw new NotFoundError('user');
    }
    // 회원 삭제 검증
    if (user.delete_date) {
      throw new BadRequestError('user who has resigned');
    }

    const validatePasswordResult = await validatePassword(loginDto.password, user.password, user.salt);
    if (!validatePasswordResult) {
      throw new BadRequestError('wrong password');
    }

    const access_token = generateAccessToken(user);
    const refresh_token = generateRefreshToken();

    await this.authRepository.upsert({ user_id: user.id, ip, token: refresh_token });

    return { access_token, refresh_token };
  }

  /**
   * 회원 탈퇴
   * @param {string} id
   */
  async resign(id) {
    const user = await this.usersService.getNotDeleteUserById(id);

    await this.usersService.deleteUser(user.id);
  }

  /**
   * 회원 재가입
   * @param {{email: string}} reRegiserDto
   */
  async reRegister(reRegiserDto) {
    await this.usersService.reRegisterUser(reRegiserDto.email);
  }

  /**
   * refresh token으로 access token 재발급
   * @param {string} ip
   * @param {{refresh_token: string}} getNewTokensDto
   * @returns {Promise<{access_token: string, refresh_token: string}>}
   */
  async getNewTokens(ip, getNewTokensDto) {
    const refresh_token = await this.authRepository.findByToken({
      where: { ip, token: getNewTokensDto.refresh_token },
      select: ['REFRESH_TOKENS.user_id', 'REFRESH_TOKENS.expire_date'],
    });
    // refresh token 유효기간 검증
    if (refresh_token.expire_date < new Date()) {
      throw new BadRequestError('refresh token expired');
    }

    const user = await this.usersService.getNotDeleteUserById(refresh_token.user_id);

    const access_token = generateAccessToken(user);
    const new_refresh_token = generateRefreshToken();

    await this.authRepository.upsert({ user_id: refresh_token.user_id, ip, token: new_refresh_token });

    return { access_token, refresh_token: new_refresh_token };
  }

  /**
   * socket 연결
   * @param {string} id
   */
  async socketConnect(id) {
    const user = await this.usersService.getNotDeleteUserById(id);

    await this.usersService.updateUser(user.id, { is_connect: 1 });
  }

  /**
   * socket 연결 해제
   * @param {string} id
   */
  async socketDisconnect(id) {
    const user = await this.usersService.getNotDeleteUserById(id);

    await this.usersService.updateUser(user.id, { is_connect: 0 });
  }
}

module.exports = { AuthService };
