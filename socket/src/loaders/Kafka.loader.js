'use strict';

const { Kafka, CompressionTypes } = require('kafkajs');
const { config } = require('../config');
const { InternalServerError } = require('../exceptions/InternalServer.exception');
const { responseKafkaInterceptor } = require('../middlewares/response.interceptor');
const { logger } = require('../utils/logger.util');

class KafkaLoader {
  constructor() {
    this.kafka = new Kafka({
      clientId: 'test-consumer',
      brokers: [config.kafka.host],
      retry: {
        initialRetryTime: 5000,
        retries: 10,
      },
    });
    this.consumer = this.kafka.consumer({ groupId: 'socket-group' });
    this.producer = this.kafka.producer();
  }

  /**
   * kafka 발행
   * @param {any} message
   */
  async publish(topic, message) {
    try {
      await this.producer.connect();

      await this.producer.send({
        topic: topic,
        compression: CompressionTypes.GZIP,
        messages: [message],
      });

      await this.producer.disconnect();
    } catch (err) {
      logger.error(`Kafka Publish: ${err}`);
      throw new InternalServerError('Kafka');
    }
  }

  /**
   *
   * @param {any} io
   */
  async subscribe(io) {
    try {
      await this.subscribeSocketCreateMemo(io);
    } catch (err) {
      throw new InternalServerError('Kafka');
    }
  }

  /**
   * kafka socket-create-memo 구독
   * @param {any} io
   */
  async subscribeSocketCreateMemo(io) {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: 'socket-create-memo', fromBeginning: true });

      await this.consumer.run({
        eachMessage: async ({ message }) => {
          const user_id = Buffer.from(message.key).toString();
          const memos = JSON.parse(message.value);

          io.to(user_id).emit('CREATE_MEMO', responseKafkaInterceptor(user_id, { memos }));
        },
      });
    } catch (err) {
      logger.error(`Kafka Subscribe(socket-create-memo): ${err}`);
    }
  }
}

module.exports = { KafkaLoader };
