'use strict';

const { Server } = require('socket.io');
const { CreateMemoDto } = require('../dtos/memos.dto');
const { responseSocketInterceptor } = require('../middlewares/response.interceptor');
const { errorInterceptor } = require('../middlewares/error.interceptor');
const { validateSocket } = require('../middlewares/validateSocket.pipe');

/**
 * 메모 관련 이벤트
 * @param {Server} io
 * @param {any} socket
 */
const MemosEvent = (io, socket) => {
  socket.on(
    'CREATE_MEMO',
    /**
     * 메모 생성
     * @param {{user_id: string, memos: any[]}} client
     */
    async client => {
      try {
        await validateSocket(CreateMemoDto, socket, client);

        io.to(client.user_id).emit(
          'CREATE_MEMO',
          responseSocketInterceptor(socket, client, { message: 'create memo' }),
        );
      } catch (err) {
        io.to(socket.data.user_id).emit('CREATE_MEMO', errorInterceptor(err, socket, client));
      }
    },
  );
};

module.exports = { MemosEvent };
