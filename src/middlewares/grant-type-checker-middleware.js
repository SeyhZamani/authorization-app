const { routerWrapper } = require('../utils/express-util');
const logger = require('../utils/logger');
const InvalidRequest = require('../models/exceptions/invalid-request-exception');


const grantTypeChecker = routerWrapper(async (req, res, next) => {
    const {
        grant_type: grantType,
    } = req.body;

    if (!grantType || (grantType !== 'password' || grantType !== 'refresh_token')) {
        return next(new InvalidRequest('Unsupported grant_type'));
    }
    req.grantType = grantType;
    logger.info(`Starting to  generating token ${req.grantType}`);
    return next();
});


exports.grantTypeChecker = grantTypeChecker;
