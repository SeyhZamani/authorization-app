const kafka = require('kafka-node');
const { promisify } = require('util');
const logger = require('../utils/logger');

exports.create = () => new Promise((resolve, reject) => {
    const options = {
        kafkaHost: process.env.KAFKA_BROKER_HOST,
    };
    const client = new kafka.KafkaClient(options);
    const producer = new kafka.HighLevelProducer(client);
    producer.on('ready', () => {
        logger.info('Kafka Producer is ready to send message');
        return resolve(producer);
    });
    producer.on('error', (err) => {
        logger.error(err);
        return reject(err);
    });
    producer.closeAsync = promisify(producer.client.close).bind(producer.client);
});
