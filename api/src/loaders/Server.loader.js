'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const { UsersRouter } = require('../routers/users.router');
const { logger } = require('../utils/logger.util');
const { config } = require('../config');
const { errorInterceptor } = require('../middlewares/error.interceptor');
const { NotFoundError } = require('../exceptions/NotFound.exception');
const { AuthRouter } = require('../routers/auth.router');
const { authGuard } = require('../middlewares/auth.guard');
const { MemosRouter } = require('../routers/memos.router');
const { TasksRouter } = require('../routers/tasks.router');
const { KafkaLoader } = require('./kafka.loader');
const { Container } = require('./Container.loader');

class ServerLoader {
  /**
   *
   * @param {Container} container
   * @param {KafkaLoader} kafka
   */
  constructor(container, kafka) {
    this.container = container;
    this.app = express();
    this.server = http.createServer(this.app);
    this.kakfa = kafka;

    this.setMiddlewares();
    this.setRouters();
  }

  /**
   * dependency middleware 설정
   */
  setMiddlewares() {
    // express
    this.app.use(express.json({ limit: config.server.contentsLimit })); // application/json 설정
    this.app.use(express.urlencoded({ extended: false, limit: config.server.contentsLimit })); // x-www-form-urlencoded 설정

    // cors
    this.app.use(cors()); // cors 허용

    // helmet
    this.app.use(helmet());
    this.app.use(helmet.contentSecurityPolicy(config.helmet.security)); // content 보안 정책 설정

    // proxy 설정
    this.app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
    this.app.set('etag', false);

    // method 설정
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');
      req.method.toLowerCase() === 'options' && res.status(200).json('Success');

      return next();
    });
  }

  /**
   * routing 설정
   */
  setRouters() {
    this.app.use('/api/auth', AuthRouter(this.container.getAuthService()));
    this.app.use('/api/users', authGuard, UsersRouter(this.container.getUsersService()));
    this.app.use('/api/memos', authGuard, MemosRouter(this.kakfa, this.container.getMemosService()));
    this.app.use('/api/tasks', authGuard, TasksRouter(this.container.getTasksService()));

    // 존재하지 않는 api 주소 설정
    this.app.use('*', (req, res, next) => {
      return next(new NotFoundError('api address'));
    });

    this.app.use(errorInterceptor);
  }

  /**
   * 서버 시작
   * @param {number} port
   */
  async startServer(port) {
    try {
      this.server.listen(port, '0.0.0.0', () => {
        logger.info(`API Worker is running on ${port} `);
        logger.info(`Worker setting is ${process.env.NODE_ENV} Mode`);
      });

      // pm2 setting
      process.env.NODE_ENV !== 'dev' && process.send('ready') && logger.info('> sent ready for PM2');
    } catch (err) {
      logger.error(`Server: ${err}`);
    }
  }
}

module.exports = { ServerLoader };
