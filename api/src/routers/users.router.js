'use strict';

const { Router, Request, Response, NextFunction } = require('express');
const { UpdateUserDto } = require('../dtos/users.dto');
const { ForbiddenError } = require('../exceptions/Forbidden.exception');
const { responseInterceptor } = require('../middlewares/response.interceptor');
const { uploadUserImage } = require('../middlewares/upload.middleware');
const { validateBody } = require('../middlewares/validateBody.pipe');
const { UsersService } = require('../services/users.service');

/**
 * 회원 관련 api
 * @param {UsersService} usersService
 * @returns {Router}
 */
const UsersRouter = usersService => {
  const router = Router();

  router.get(
    '/',
    /**
     * 회원 목록 조회
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response | void>}
     */
    async (req, res, next) => {
      try {
        const result = await usersService.getUsers();

        return res.status(200).json(responseInterceptor(req, result));
      } catch (err) {
        return next(err);
      }
    },
  );

  router.get(
    '/:id',
    /**
     * id별 회원 조회
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response | void>}
     */
    async (req, res, next) => {
      try {
        const id = req.params.id;

        const result = await usersService.getUserById(id);

        return res.status(200).json(responseInterceptor(req, result));
      } catch (err) {
        return next(err);
      }
    },
  );

  router.put(
    '/:id',
    uploadUserImage.single('file'),
    validateBody(UpdateUserDto),
    /**
     * 회원 수정
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response | void>}
     */
    async (req, res, next) => {
      try {
        const id = req.params.id;
        const user_id = req.user.user_id;
        // 수정 권한 검증
        if (id !== user_id) throw new ForbiddenError('only update your information');

        const image_url = req.file?.location || null;

        await usersService.updateUser(id, { ...req.body, image_url });

        return res.status(200).json(responseInterceptor(req));
      } catch (err) {
        return next(err);
      }
    },
  );

  return router;
};

module.exports = { UsersRouter };
