'use strict';

const config = {
  server: {
    port: process.env.THIS_API_SERVER_PORT,
    contentsLimit: '10mb',
  },
  helmet: {
    security: {
      directives: {
        defaultSrc: ["'self'", 'ws://localhost:3000'],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        frameSrc: ["'self'"],
      },
    },
  },
  rdbms: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    charset: 'utf8mb4',
  },
  nosql: {
    contactPoints: [process.env.CASSANDRA_CONTACTPOINT],
    keyspace: process.env.CASSANDRA_KEYSPACE,
    localDataCenter: process.env.CASSANDRA_DATACENTER,
  },
  kafka: {
    host: process.env.KAFKA_HOST,
  },
  jwt: {
    secret: process.env.JWT_SECRET_KEY,
    expiresIn: '1d',
  },
  aws: {
    region: process.env.AWS_S3_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_SECRETKEY,
  },
};

module.exports = { config };
