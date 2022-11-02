'use strict';

const joi = require('joi');

const RegisterDto = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).max(18).required(),
});

const LoginDto = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

const ReRegisterDto = joi.object({
  email: joi.string().email().required(),
});

const GetNewTokensDto = joi.object({
  refresh_token: joi.string().required(),
});

module.exports = { RegisterDto, LoginDto, ReRegisterDto, GetNewTokensDto };
