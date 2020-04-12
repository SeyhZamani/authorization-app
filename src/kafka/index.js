const playerCreatedProducer = require('./producer');
const logger = require('../utils/logger');

let producer;

exports.initiate = async () => {
    logger.info('*******Kafka is initiating********');
    logger.info('Kafka producer is initiating');
    producer = await playerCreatedProducer.create();
};

exports.getProducer = () => {
    if (!producer) {
        throw new Error('producer hase not been created yet!');
    }
    return producer;
};
