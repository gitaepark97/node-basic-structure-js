'use strict';

const config = {
  server: {
    port: process.env.THIS_SOCKET_SERVER_PORT,
  },
  memorydb: {
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  },
  kafka: {
    host: process.env.KAFKA_HOST,
  },
  api: {
    url: process.env.API_URL,
  },
};

module.exports = { config };
