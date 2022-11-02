'use strict';

const { Router, Request, Response, NextFunction } = require('express');
const { RegisterDto, LoginDto, ReRegisterDto, GetNewTokensDto } = require('../dtos/auth.dto');
const { ForbiddenError } = require('../exceptions/Forbidden.exception');
const { authGuard } = require('../middlewares/auth.guard');
const { responseInterceptor } = require('../middlewares/response.interceptor');
const { validateBody } = require('../middlewares/validateBody.pipe');
const { AuthService } = require('../services/auth.service');

/**
 * 회원 인증 관련 api
 * @param {AuthService} authService
 * @returns {Router}
 */
const AuthRouter = authService => {
  const router = Router();

  router.post(
    '/register',
    validateBody(RegisterDto),
    /**
     * 회원가입
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response | void>}
     */
    async (req, res, next) => {
      try {
        await authService.register(req.body);

        return res.status(200).json(responseInterceptor(req));
      } catch (err) {
        return next(err);
      }
    },
  );

  router.post(
    '/login',
    validateBody(LoginDto),
    /**
     * 로그인
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response | void>}
     */
    async (req, res, next) => {
      try {
        const ip = req.ip.replace('::ffff:', '');

        const result = await authService.login(req.body, ip);

        return res.status(200).json(responseInterceptor(req, result));
      } catch (err) {
        return next(err);
      }
    },
  );

  router.delete(
    '/',
    authGuard,
    /**
     * 회원 탈퇴
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response | void>}
     */
    async (req, res, next) => {
      try {
        const user_id = req.user.user_id;

        await authService.resign(user_id);

        return res.status(200).json(responseInterceptor(req));
      } catch (err) {
        return next(err);
      }
    },
  );

  router.post(
    '/re-register',
    validateBody(ReRegisterDto),
    /**
     * 회원 재가입
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response | void>}
     */
    async (req, res, next) => {
      try {
        await authService.reRegister(req.body);

        return res.status(200).json(responseInterceptor(req));
      } catch (err) {
        return next(err);
      }
    },
  );

  router.post(
    '/tokens',
    validateBody(GetNewTokensDto),
    /**
     * refresh token으로 access token 재발급
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response | void>}
     */
    async (req, res, next) => {
      try {
        const ip = req.ip.replace('::ffff:', '');

        const result = await authService.getNewTokens(ip, req.body);

        return res.status(200).json(responseInterceptor(req, result));
      } catch (err) {
        return next(err);
      }
    },
  );

  router.post(
    '/connect/:id',
    authGuard,
    /**
     * socket 연결
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response | void>}
     */
    async (req, res, next) => {
      try {
        const user_id = req.user.user_id;
        const id = req.params.id;

        if (user_id !== id) {
          throw new ForbiddenError('only update your information');
        }

        await authService.socketConnect(id);

        return res.status(200).json(responseInterceptor(req));
      } catch (err) {
        return next(err);
      }
    },
  );

  router.delete(
    '/connect/:id',
    authGuard,
    /**
     * socket 연결 해제
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response | void>}
     */
    async (req, res, next) => {
      try {
        const user_id = req.user.user_id;
        const id = req.params.id;

        if (user_id !== id) {
          throw new ForbiddenError('only update your information');
        }

        await authService.socketDisconnect(id);

        return res.status(200).json(responseInterceptor(req));
      } catch (err) {
        return next(err);
      }
    },
  );

  return router;
};

module.exports = { AuthRouter };
