import MessageQueue from 'react-native/Libraries/BatchedBridge/MessageQueue.js';

let queue = [];
let now = 0;

export default {
  start: () => {
    MessageQueue.spy(msg => {
        now = now || new Date().getTime();
        const queueItem = {
          ...msg,
          time: now,
        };
        queue.push(queueItem);
        now = new Date();
    });
  },
  stop: () => {
    MessageQueue.spy(false);
  },
  log: () => {
    queue.forEach(item => console.log('item - ', item));
    queue = [];
  }
};