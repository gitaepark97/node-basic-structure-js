'use strict';

const joi = require('joi');

const CreateMemoDto = joi.object({
  memo: joi.string().required(),
});

module.exports = { CreateMemoDto };
