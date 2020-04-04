const logger = require('../utils/logger');

const errorHandlerMiddleware = (err, req, res, next) => {
    logger.error(err.stack);
    return res.status(res.statusCode || 500).send(err.message);
};

exports.errorHandler = errorHandlerMiddleware;
