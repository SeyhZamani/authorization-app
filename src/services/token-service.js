const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const cacheAdapter = require('../utils/cache');

const {
    REFRESH_TOKEN_EXPIRATION,
    ACCESS_TOKEN_EXPIRATION,
} = process.env;
const privateKey = fs.readFileSync(path.resolve(__dirname, '../../config/private.pem'), {
    encoding: 'utf8',
});


const generateAccessToken = (userId) => new Promise((resolve, reject) => {
    if (!userId) {
        return reject(new Error('System can not generate access-token with undefined userId'));
    }
    logger.info('Generating access token...');
    return jwt.sign({
        userId,
        exp: Math.floor(Date.now() / 1000) + (parseInt(ACCESS_TOKEN_EXPIRATION, 10)),
    }, privateKey, { algorithm: 'RS256' }, (err, token) => {
        if (err) {
            return reject(err);
        }
        return resolve(token);
    });
});


const generateRefreshToken = (userId) => new Promise((resolve, reject) => {
    if (!userId) {
        return reject(new Error('System can not generate refresh-token with undefined userId'));
    }
    const client = cacheAdapter.getClient();
    const newRefreshToken = uuidv4();
    return client.set(newRefreshToken, userId, 'EX', REFRESH_TOKEN_EXPIRATION, (errSet, _) => {
        if (errSet) {
            return reject(errSet);
        }
        return resolve(newRefreshToken);
    });
});


module.exports = {
    generateAccessToken,
    generateRefreshToken,
};
