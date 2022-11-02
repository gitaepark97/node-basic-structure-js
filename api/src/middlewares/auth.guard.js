'use strict';

const { Request, Response, NextFunction } = require('express');
const jwt = require('jsonwebtoken');
const { config } = require('../config');

/**
 * access token 인가
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void | Response>}
 */
const authGuard = async (req, res, next) => {
  try {
    // socket 서버용
    if (req.headers.key === 'socket') {
      req.user = { user_id: req.headers.user_id };

      return next();
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ name: 'Unauthorized', message: 'access token empty' });

    const jwtPayload = jwt.verify(token, config.jwt.secret);
    req.user = jwtPayload;

    return next();
  } catch (err) {
    if (err?.message === 'jwt expired') {
      return res.status(401).json({ name: 'Unauthorized', message: 'access token expired' });
    }

    return res.status(401).json({ name: 'Unauthorized', message: 'access token invalid' });
  }
};

module.exports = { authGuard };
