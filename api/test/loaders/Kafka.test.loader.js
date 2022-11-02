'use strict';

class TestKafkaLoader {
  /**
   * @param {TestContainer} container
   */
  constructor(container) {
    this.container = container;
    this.messageQueue = {};
  }

  async publish(topic, message) {
    try {
      if (!this.messageQueue[topic]) {
        this.messageQueue[topic] = [];
      }

      this.messageQueue[topic].push(message);

      this.subscribe();
    } catch (err) {}
  }

  async subscribe() {
    this.subscribeCreateMemo(this.container.getMemosService());
  }

  async subscribeCreateMemo(memosService) {
    if (this.messageQueue['create-memo'] && this.messageQueue['create-memo'].length !== 0) {
      const message = this.messageQueue['create-memo'].shift();

      const user_id = message.key;
      const createMemoDto = JSON.parse(message.value);

      await memosService.createMemo(user_id, createMemoDto);
      const { memos } = await memosService.getMemosByUserId(user_id);

      const kafkaMessage = {
        key: user_id,
        value: JSON.stringify(memos),
      };

      this.publish('socket-create-memo', kafkaMessage);
    }
  }
}

module.exports = { TestKafkaLoader };
