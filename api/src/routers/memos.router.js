'use strict';

const { Router, Request, Response, NextFunction } = require('express');
const { CreateMemoDto } = require('../dtos/memos.dto');
const { KafkaLoader } = require('../loaders/kafka.loader');
const { responseInterceptor } = require('../middlewares/response.interceptor');
const { validateBody } = require('../middlewares/validateBody.pipe');
const { MemosService } = require('../services/memos.service');

/**
 * 메모 관련 api
 * @param {KafkaLoader} kafka
 * @param {MemosService} momesService
 * @returns {Router}
 */
const MemosRouter = (kakfa, momesService) => {
  const router = Router();

  router.post(
    '/',
    validateBody(CreateMemoDto),
    /**
     *
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response | void>}
     */
    async (req, res, next) => {
      try {
        const user_id = req.user.user_id;

        const kafkaMessage = {
          key: user_id,
          value: JSON.stringify(req.body),
        };

        await kakfa.publish('create-memo', kafkaMessage);

        return res.status(200).json(responseInterceptor(req, { message: 'Send Success' }));
      } catch (err) {
        return next(err);
      }
    },
  );

  router.get(
    '/',
    /**
     * 회원별 메모 목록 조회
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response | void>}
     */
    async (req, res, next) => {
      try {
        const user_id = req.user.user_id;

        const result = await momesService.getMemosByUserId(user_id);

        return res.status(200).json(responseInterceptor(req, result));
      } catch (err) {
        return next(err);
      }
    },
  );

  return router;
};

module.exports = { MemosRouter };
