const router = require('express').Router();
const { routerWrapper } = require('../utils/express-util');
const { generateAccessToken, generateRefreshToken } = require('../services/token-service');

const logger = require('../utils/logger');

const { ACCESS_TOKEN_EXPIRATION: expiration } = process.env;


router.post('/', routerWrapper(async (req, res, next) => {
    logger.info('Starting to generate access token and refresh token');
    const { userId } = req;
    if (!userId) {
        return next(new Error('UserId does not exist for generating token'));
    }
    const refreshToken = await generateRefreshToken(userId);
    const accessToken = await generateAccessToken(userId);
    return res.status(200).json({
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: 'bearer',
        expires_in: expiration,
    });
}));

module.exports = router;
