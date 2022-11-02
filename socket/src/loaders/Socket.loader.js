'use strict';

const { Server } = require('socket.io');
const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');
const axios = require('axios');
const { config } = require('../config');
const { MemosEvent } = require('../events/memos.event');
const { logger } = require('../utils/logger.util');

const pubClient = createClient({
  url: config.memorydb.host,
  password: config.memorydb.password,
});
const subClient = pubClient.duplicate();

class SocketLoader {
  constructor() {
    this.socketIo = new Server();
  }

  /**
   * socket adapter 설정
   * @param {{pubClient: redis.RedisClient, subClient: redis.RedisClient}} adapterConfing
   */
  setAdapter(io, adapterConfing = { pubClient, subClient }) {
    Promise.all([adapterConfing.pubClient.connect(), adapterConfing.subClient.connect()])
      .then(() => {
        io.adapter(createAdapter(adapterConfing.pubClient, adapterConfing.subClient));
      })
      .catch(err => logger.error(`Redis: ${err}`));
  }

  /**
   * middleware 설정
   * @param {any} io
   */
  setMiddleware(io) {
    io.use(async (socket, next) => {
      const user_id = socket.handshake.query.user_id;

      logger.info(`[connecting...] socket.id: ${socket.id}, user_id ${user_id}`);

      if (!user_id) {
        const error = new Error();
        error.data = { name: 'Bad Request', message: 'user_id' };

        setTimeout(() => {
          socket.disconnect();
        }, 100);

        return next(error);
      }

      if (user_id !== 'api') {
        try {
          // 회원 검증
          await axios.post(
            `${config.api.url}/auth/connect/${user_id}`,
            {},
            {
              headers: {
                key: 'socket',
                user_id: user_id,
              },
            },
          );
        } catch (err) {
          const error = new Error();
          error.data = err.response?.data || { name: 'Internal Server', message: 'api server' };

          setTimeout(() => {
            socket.disconnect();
          }, 100);
          return next(error);
        }
      }

      socket.data.user_id = user_id;

      logger.info(`[authenficated] socket.id: ${socket.id}, user_id: ${socket.data.user_id}`);

      next();
    });
  }

  /**
   * socket 연결 및 연결 해제
   * @param {any} io
   */
  connectSocket(io) {
    io.on('connect', async socket => {
      logger.info(`[connected] socket.id: ${socket.id}, user_id: ${socket.data.user_id}}`);

      if (socket.data.user_id === 'api') {
        socket.join('SERVER');
      } else {
        socket.join('NOTIFICATION');
      }

      socket.join(socket.data.user_id);

      MemosEvent(io, socket);

      // socket 연결 해제
      socket.on('disconnect', async reason => {
        if (socket.data.user_id === 'api') {
          socket.leave('SERVER');
        } else {
          socket.leave('NOTIFICATION');
          try {
            await axios.delete(`${config.api.url}/auth/connect/${socket.data.user_id}`, {
              headers: {
                key: 'socket',
                user_id: socket.data.user_id,
              },
            });
          } catch (err) {
            setTimeout(() => {
              socket.disconnect();
            }, 100);
          }
        }

        logger.info(`[disconnecting...] reason: ${reason}, socket.id: ${socket.id}, user_id: ${socket.data.user_id}`);
      });

      socket.on('disconnect', reason => {
        logger.info(`[disconnected] reason: ${reason}, socket.id: ${socket.id}, user_id: ${socket.data.user_id}`);
      });
    });
  }

  /**
   * socket 서버 시작
   * @param {any} server
   */
  startServer(server, kafka) {
    const io = this.socketIo.attach(server);
    this.setAdapter(io);
    this.setMiddleware(io);
    this.connectSocket(io);
    kafka.subscribe(io);
  }
}

module.exports = { SocketLoader };
