'use strict';

const { config } = require('./config');
const { KafkaLoader } = require('./loaders/Kafka.loader');
const { ServerLoader } = require('./loaders/Server.loader');
const { SocketLoader } = require('./loaders/Socket.loader');

/**
 * 서버 시작
 */
const main = () => {
  const server = new ServerLoader(new KafkaLoader(), new SocketLoader());

  server.startServer(config.server.port);
};

main();
