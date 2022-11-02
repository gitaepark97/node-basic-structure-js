'use strict';

const { BadRequestError } = require('../exceptions/BadRequest.exception');
const { NotFoundError } = require('../exceptions/NotFound.exception');
const { UsersRepository } = require('../repositories/users.repository');

class UsersService {
  /**
   * @param {UsersRepository} usersRepository // 의존성 주입
   */
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  /**
   *
   * @param {{email: string, password: string, salt: string}} registerDto
   */
  async createUser(email, password, salt) {
    await this.usersRepository.create({ email, password, salt });
  }

  /**
   * 회원 목록 조회
   * @returns {Promise<{users: any[], count: number}>}
   */
  async getUsers() {
    const [users, count] = await this.usersRepository.findAndCount();

    return { users, count };
  }

  /**
   * id별 회원 조회
   * @param {string} id
   * @returns {Promise<any>}
   */
  async getUserById(id) {
    const user = await this.usersRepository.findById(id);

    return { user };
  }

  /**
   *
   * @param {string} email
   * @returns {Promise<any>}
   */
  async getUserByEmail(email) {
    return this.usersRepository.findByEmail(email, {
      select: ['USERS.id', 'USERS.password', 'USERS.salt', 'USERS.delete_date'],
    });
  }

  /**
   * 회원 삭제 여부 판단
   * @param {string} id
   * @returns {Promise<any>}
   */
  async getNotDeleteUserById(id) {
    const user = await this.usersRepository.findById(id, { select: ['USERS.id', 'USERS.delete_date'] });
    // 회원 삭제 검증
    if (user.delete_date) {
      throw new BadRequestError('user who has resigned');
    }

    return user;
  }

  /**
   * 회원 수정
   * @param {string} id
   * @param {{name?: string, }} updateUserDto
   */
  async updateUser(id, updateUserDto) {
    const user = await this.getNotDeleteUserById(id);

    await this.usersRepository.update({ ...user, ...updateUserDto });
  }

  /**
   *
   * @param {string} id
   */
  async deleteUser(id) {
    await this.usersRepository.softDeleteById(id);
  }

  /**
   *
   * @param {string} email
   */
  async reRegisterUser(email) {
    const user = await this.getUserByEmail(email);
    // 회원 검증
    if (!user) {
      throw new NotFoundError('user');
    }
    // 회원 삭제 검증
    if (!user.delete_date) {
      throw new BadRequestError('user already register');
    }

    await this.usersRepository.update({ id: user.id, delete_date: null });
  }
}

module.exports = { UsersService };
