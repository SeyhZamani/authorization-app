const kafka = require('kafka-node');
const { promisify } = require('util');
const logger = require('../utils/logger');

exports.create = () => new Promise((resolve, reject) => {
    const clientOptions = {
        kafkaHost: process.env.KAFKA_BROKER_HOST,
    };
    const producerOptions = {
        requireAcks: 1,
        ackTimeoutMs: 100,
    };
    const client = new kafka.KafkaClient(clientOptions);
    const producer = new kafka.HighLevelProducer(client, producerOptions);
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
