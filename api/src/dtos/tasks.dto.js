'use strict';

const joi = require('joi');

const CreateTasksDto = joi.object({
  titles: joi.array().items(joi.string()).required(),
});

const UpdateTaskDto = joi.object({
  title: joi.string().optional(),
  is_done: joi.number().optional(),
});

module.exports = { CreateTasksDto, UpdateTaskDto };
