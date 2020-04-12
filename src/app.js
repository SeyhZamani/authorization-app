const redis = require('redis');
const logger = require('./utils/logger');
const dbAdapter = require('./utils/database');
const kafka = require('./kafka');

const { setupServer } = require('./server');

const run = async () => {

    const client = redis.createClient({ password: 'secret' });
    client.on('connect', function() {
        console.log('Redis client connected');
    });

    dbAdapter.initDB();
    await dbAdapter.authenticate();
    await kafka.initiate();

    const server = setupServer();

    process.on('SIGTERM', () => {
        logger.info('Got SIGTERM. Gracefully shutdown is starting..');
        server.close((serverCloseErr) => {
            if (serverCloseErr) {
                logger.error(serverCloseErr);
                process.exit(1);
            }
            dbAdapter.disconnect((dbCloseError) => {
                if (dbCloseError) {
                    logger.error(dbCloseError);
                    process.exit(1);
                }
                process.exit();
            });
        });
    });
};

run();
