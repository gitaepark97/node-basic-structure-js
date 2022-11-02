'use strict';

const { ServerLoader } = require('../src/loaders/server.loader');
const { TestContainer } = require('./loaders/Conatiner.loader');
const { TestKafkaLoader } = require('./loaders/kafka.test.loader');

const testContainer = new TestContainer();

const server = new ServerLoader(testContainer, new TestKafkaLoader(testContainer));

module.exports = { server };
