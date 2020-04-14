const logger = require('./utils/logger');
const dbAdapter = require('./utils/database');
const kafka = require('./kafka');
const cacheAdapter = require('./utils/cache');

const { setupServer } = require('./server');

const run = async () => {
    dbAdapter.init();
    await dbAdapter.authenticate();
    await cacheAdapter.init();
    await cacheAdapter.authenticate();
    await kafka.initiate();

    const server = setupServer();

    process.on('SIGTERM', async () => {
        logger.info('Got SIGTERM. Gracefully shutdown is starting..');
        server.close(async (serverCloseErr) => {
            if (serverCloseErr) {
                logger.error(serverCloseErr);
                process.exit(1);
            }
            await dbAdapter.disconnect();
            await cacheAdapter.disconnect();
            process.exit();
        });
    });
};

run();
