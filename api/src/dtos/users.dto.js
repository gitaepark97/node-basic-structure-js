'use strict';

const joi = require('joi');

const UpdateUserDto = joi.object({
  name: joi.string().optional(),
});

module.exports = { UpdateUserDto };
