const { routerWrapper } = require('../utils/express-util');
const logger = require('../utils/logger');
const InvalidRequest = require('../models/exceptions/invalid-request-exception');
const cacheAdapter = require('../utils/cache');

const refreshTokenValidator = routerWrapper(async (req, res, next) => {
    logger.info('Starting to validate refresh token request');
    const {
        refresh_token: rawRefreshToken = '',
    } = req.body;
    const refreshToken = rawRefreshToken.trim();
    if (!refreshToken) {
        return next(new InvalidRequest('refresh token is mandatory field'));
    }
    const client = cacheAdapter.getClient();
    client.get(refreshToken, (errGet, id) => {
        if (errGet) {
            return next(errGet);
        }
        req.userId = id;
        return next();
    });
});


exports.refreshTokenValidator = refreshTokenValidator;
