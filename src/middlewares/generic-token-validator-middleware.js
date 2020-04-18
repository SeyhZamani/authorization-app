const { routerWrapper } = require('../utils/express-util');
const logger = require('../utils/logger');
const InvalidRequest = require('../models/exceptions/invalid-request-exception');
const { accessTokenValidator } = require('./access-token-validator-middleware');
const { refreshTokenValidator } = require('./refresh-token-validator-middleware');

const genericTokenValidatorMiddleware = routerWrapper(async (req, res, next) => {
    const {
        grant_type: grantType,
    } = req.body;

    if (!grantType || !(grantType === 'password' || grantType === 'refresh_token')) {
        return next(new InvalidRequest('Unsupported grant_type'));
    }
    req.grantType = grantType;
    logger.info(`Starting to  generating token ${req.grantType}`);
    if (grantType === 'password') {
        accessTokenValidator(req, res, next);
    } else if (grantType === 'refresh_token') {
        refreshTokenValidator(req, res, next);
    } else {
        next(new Error('Undefined token middleware'));
    }
});


exports.genericTokenValidatorMiddleware = genericTokenValidatorMiddleware;
