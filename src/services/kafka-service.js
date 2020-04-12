const retry = require('retry');
const kafka = require('../kafka');
const logger = require('../utils/logger');

const sendMessage = (message) => new Promise((resolve, reject) => {
    const producer = kafka.getProducer();
    const operation = retry.operation();
    operation.attempt(() => {
        producer.send(message, (err, data) => {
            if (operation.retry(err)) {
                return;
            }
            if (err) {
                logger.error(err);
                return reject(operation.mainError());
            }
            return resolve(data);
        });
    });
});

module.exports = {
    sendMessage,
};
