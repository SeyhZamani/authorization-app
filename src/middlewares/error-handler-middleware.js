const logger = require('../utils/logger');
const InvalidRequest = require('../models/exceptions/invalid-request-exception');
const AuthorizationError = require('../models/exceptions/authorization-exception');

const errorHandlerMiddleware = (err, req, res, next) => {
    logger.error(err.stack);
    if (err instanceof InvalidRequest) {
        res.status(400);
    } else if (err instanceof AuthorizationError) {
        res.status(401);
    }
    return res.status(res.statusCode || 500).json({ error: err.message });
};

exports.errorHandler = errorHandlerMiddleware;
