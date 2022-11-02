'use strict';

const { Kafka, CompressionTypes } = require('kafkajs');
const { config } = require('../config');
const { InternalServerError } = require('../exceptions/InternalServer.exception');
const { MemosService } = require('../services/memos.service');
const { logger } = require('../utils/logger.util');

class KafkaLoader {
  /**
   *
   * @param {any} container
   */
  constructor(container) {
    this.container = container;
    this.kafka = new Kafka({
      clientId: 'test-consumer',
      brokers: [config.kafka.host],
      retry: {
        initialRetryTime: 5000,
        retries: 10,
      },
    });
    this.consumer = this.kafka.consumer({ groupId: 'api-group' });
    this.producer = this.kafka.producer();

    this.subscribe();
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
        acks: 1,
        messages: [message],
      });

      await this.producer.disconnect();
    } catch (err) {
      logger.error(`Kafka Publish: ${err}`);
      throw new InternalServerError('Kafka');
    }
  }

  /**
   *  kafka 구독
   */
  async subscribe() {
    try {
      await this.subscribeCreateMemo(this.container.getMemosService());
    } catch (err) {
      throw new InternalServerError('Kafka');
    }
  }

  /**
   * kafka create-memo 구독
   * @param {MemosService} memosService
   */
  async subscribeCreateMemo(memosService) {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: 'create-memo', fromBeginning: true });

      await this.consumer.run({
        eachMessage: async ({ message }) => {
          const user_id = Buffer.from(message.key).toString();
          const createMemoDto = JSON.parse(message.value);

          await memosService.createMemo(user_id, createMemoDto);
          const { memos } = await memosService.getMemosByUserId(user_id);

          const kafkaMessage = {
            key: user_id,
            value: JSON.stringify(memos),
          };

          this.publish('socket-create-memo', kafkaMessage);
        },
      });
    } catch (err) {
      logger.error(`Kafka Subscribe(create-memo): ${err}`);
    }
  }
}

module.exports = { KafkaLoader };
