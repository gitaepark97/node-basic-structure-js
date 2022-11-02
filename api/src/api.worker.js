'use strict';

const { ServerLoader } = require('./loaders/Server.loader');
const { config } = require('./config');
const { KafkaLoader } = require('./loaders/Kafka.loader');
const { Container } = require('./loaders/Container.loader');

/**
 * 서버 시작
 */
const main = async () => {
  const container = new Container();

  const server = new ServerLoader(container, new KafkaLoader(container));

  await server.startServer(config.server.port);
};

main();
