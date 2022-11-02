'use strict';

const joi = require('joi');

const CreateMemoDto = joi.object({
  socket: joi
    .object({
      data: joi.object().keys({
        user_id: joi.string().required(),
      }),
    })
    .unknown(true),
  client: joi.object({
    user_id: joi.string().required(),
  }),
});

module.exports = { CreateMemoDto };
