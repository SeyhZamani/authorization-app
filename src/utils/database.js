const knex = require('knex');
const logger = require('./logger');

const {
    PG_HOST: host,
    PG_PORT: port,
    PG_DATABASE: database,
    PG_USERNAME: user,
    PG_PASSWORD: password,
} = process.env;

const DataBase = {};

DataBase.getDB = () => {
    logger.info('Getting DB');
    if (typeof DataBase.db === 'undefined') {
        throw new Error('Uninitialize database error!');
    }
    return DataBase.db;
};

DataBase.init = () => {
    logger.info('Initalize DB');
    DataBase.db = knex({
        client: 'pg',
        connection: {
            host,
            port,
            database,
            password,
            user,
        },
        debug: false,
    });
};

DataBase.disconnect = () => {
    logger.info('Disconnect DB');
    if (typeof DataBase.db !== 'undefined') {
        return DataBase.db.destroy();
    }
    throw new Error('Disconnection error!');
};

DataBase.authenticate = () => {
    logger.info('Autenticate DB');
    if (typeof DataBase.db !== 'undefined') {
        return DataBase.db.raw('SELECT 1+1 as Result');
    }
    throw new Error('Authentication error!');
};

module.exports = DataBase;
