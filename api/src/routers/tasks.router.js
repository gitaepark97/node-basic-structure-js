'use strict';

const { Router, Request, Response, NextFunction } = require('express');
const { CreateTasksDto, UpdateTaskDto } = require('../dtos/tasks.dto');
const { responseInterceptor } = require('../middlewares/response.interceptor');
const { validateBody } = require('../middlewares/validateBody.pipe');
const { TasksService } = require('../services/tasks.service');

/**
 * 업무 관련 api
 * @param {TasksService} tasksService
 * @returns {Router}
 */
const TasksRouter = tasksService => {
  const router = Router();

  router.post(
    '/',
    validateBody(CreateTasksDto),
    /**
     * 다중 업무 생성
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response | void>}
     */
    async (req, res, next) => {
      try {
        const user_id = req.user.user_id;

        await tasksService.createTasksFromArray(user_id, req.body);

        return res.status(200).json(responseInterceptor(req));
      } catch (err) {
        return next(err);
      }
    },
  );

  router.get(
    '/',
    /**
     * 회원별 업무 목록 조회
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response | void>}
     */
    async (req, res, next) => {
      try {
        const user_id = req.user.user_id;

        const result = await tasksService.getTasksByUserId(user_id);

        return res.status(200).json(responseInterceptor(req, result));
      } catch (err) {
        return next(err);
      }
    },
  );

  router.get(
    '/:id',
    /**
     * id별 업무 조회
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response | void>}
     */
    async (req, res, next) => {
      try {
        const user_id = req.user.user_id;
        const task_id = req.params.id;

        const result = await tasksService.getTaskById(user_id, task_id);

        return res.status(200).json(responseInterceptor(req, result));
      } catch (err) {
        return next(err);
      }
    },
  );

  router.put(
    '/:id',
    validateBody(UpdateTaskDto),
    /**
     * 업무 수정
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response | void>}
     */
    async (req, res, next) => {
      try {
        const user_id = req.user.user_id;
        const task_id = req.params.id;

        await tasksService.updateTask(user_id, task_id, req.body);

        return res.status(200).json(responseInterceptor(req));
      } catch (err) {
        return next(err);
      }
    },
  );

  return router;
};

module.exports = { TasksRouter };
