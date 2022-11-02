'use strict';

const http = require('http');
const { logger } = require('../utils/logger.util');
const { SocketLoader } = require('./Socket.loader');
const { KafkaLoader } = require('./Kafka.loader');

class ServerLoader {
  /**
   *
   * @param {KafkaLoader} kafka
   * @param {SocketLoader} socket
   */
  constructor(kafka, socket) {
    this.server = http.createServer();
    this.kafka = kafka;
    this.socket = socket;
  }

  /**
   * 서버 시작
   * @param {number} port
   */
  startServer(port) {
    try {
      this.server.listen(port, () => {
        logger.info(`API Worker is running on ${port} `);
        logger.info(`Worker setting is ${process.env.NODE_ENV} Mode`);
      });

      this.socket.startServer(this.server, this.kafka);

      // pm2 setting
      process.env.NODE_ENV !== 'dev' && process.send('ready') && logger.info('> sent ready for PM2');
    } catch (err) {
      logger.error(`Server: ${err}`);
    }
  }
}

module.exports = { ServerLoader };
