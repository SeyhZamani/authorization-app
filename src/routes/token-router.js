const router = require('express').Router();
const bcrypt = require('bcrypt');
const { routerWrapper } = require('../utils/express-util');
const { generateAccessToken } = require('../services/token-service');
const AuthorizationError = require('../models/exceptions/authorization-exception');
const logger = require('../utils/logger');

const { ACCESS_TOKEN_EXPIRATION: expiration } = process.env;


router.post('/', routerWrapper(async (req, res, next) => {
    logger.info('Starting process of generating token');
    const { password, user } = req;
    const result = await bcrypt.compare(password, user.getPassHash());
    if (!result) {
        return next(new AuthorizationError('Authorization failed'));
    }
    const token = generateAccessToken(user);
    return res.status(200).json({
        access_token: token,
        token_type: 'bearer',
        expires_in: expiration,
    });
}));

module.exports = router;
