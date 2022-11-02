'use strict';

const { MemosRepository } = require('../repositories/memos.repository');
const { UsersService } = require('../services/users.service');

class MemosService {
  /**
   * @param {MemosRepository} memosRepository // 의존성 주입
   * @param {UsersService} usersService // 의존성 주입
   */
  constructor(memosRepository, usersService) {
    this.memosRepository = memosRepository;
    this.usersService = usersService;
  }

  /**
   * 메모 생성
   * @param {string} user_id
   * @param {{memo: string}} createMemoDto
   */
  async createMemo(user_id, createMemoDto) {
    const user = await this.usersService.getNotDeleteUserById(user_id);

    await this.memosRepository.create({ user_id: user.id, memo: createMemoDto.memo });
  }

  /**
   * 회원별 메모 목록 조회
   * @param {string} user_id
   * @returns {Promise<{memos: any[]>}
   */
  async getMemosByUserId(user_id) {
    const user = await this.usersService.getNotDeleteUserById(user_id);

    const memos = await this.memosRepository.findByUserId(user.id);

    return { memos };
  }
}

module.exports = { MemosService };
