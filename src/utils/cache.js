const redis = require('redis');
const logger = require('./logger');


const {
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD,
} = process.env;

const Cache = {};

Cache.init = () => new Promise((resolve, reject) => {
    logger.info('*******Redis is initiating********');
    Cache.client = redis.createClient({
        host: REDIS_HOST,
        port: REDIS_PORT,
        password: REDIS_PASSWORD,
    });
    Cache.client.on('connect', () => {
        logger.info('Redis connected');
        return resolve(Cache.client);
    });
    Cache.client.on('error', (err) => {
        logger.error(err);
        return reject(err);
    });
});


Cache.getClient = () => {
    logger.info('Getting Client');
    if (typeof Cache.client === 'undefined') {
        throw new Error('Uninitialize cache error!');
    }
    return Cache.client;
};

Cache.disconnect = () => new Promise((resolve, reject) => {
    logger.info('Disconnect cache');
    if (typeof Cache.client !== 'undefined') {
        Cache.client.quit((err) => {
            if (err) {
                return reject(err);
            }
            return resolve(Cache.client);
        });
    } else {
        return reject(new Error('Disconnection error!'));
    }
});

Cache.authenticate = () => new Promise((resolve, reject) => {
    logger.info('Autenticate cache');
    if (typeof Cache.client !== 'undefined') {
        return Cache.client.auth(REDIS_PASSWORD, (err) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }
            return resolve(Cache.client);
        });
    }
    return reject(new Error('Authentication error!'));
});


module.exports = Cache;
