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
const privateKey = fs.readFileSync(path.resolve(__dirname, '../../config/private.pem'));


const generateAccessToken = (user) => new Promise((resolve, reject) => {
    if (!user || !user.getID()) {
        return reject(new Error('System can not generate access-token with undefined id'));
    }
    const id = user.getID();
    logger.info('Generating access token...');
    return jwt.sign({
        userId: id,
        exp: Math.floor(Date.now() / 1000) + (parseInt(ACCESS_TOKEN_EXPIRATION, 10)),
    }, privateKey, { algorithm: 'RS256' }, (err, token) => {
        if (err) {
            return reject(err);
        }
        return resolve(token);
    });
});

const regenerateRefreshToken = (refreshToken) => new Promise((resolve, reject) => {
    if (!refreshToken) {
        return reject(new Error('System can not re-generate refres-token with undefined refreshToken'));
    }
    const client = cacheAdapter.getClient();
    const newRefreshToken = uuidv4();
    return client.get(refreshToken, (errGet, id) => {
        if (errGet) {
            return reject(errGet);
        }
        if (!id) {
            return reject(new Error('Unauthorized'));
        }
        return client.set(newRefreshToken, id, 'EX', REFRESH_TOKEN_EXPIRATION, (errSet, _) => {
            if (errSet) {
                return reject(errSet);
            }
            return resolve(newRefreshToken);
        });
    });
});

const generateRefreshToken = (user) => new Promise((resolve, reject) => {
    if (!user || !user.getID()) {
        return reject(new Error('System can not generate refresh-token with undefined id'));
    }
    const id = user.getID();
    const client = cacheAdapter.getClient();
    const newRefreshToken = uuidv4();
    return client.set(newRefreshToken, id, 'EX', REFRESH_TOKEN_EXPIRATION, (errSet, _) => {
        if (errSet) {
            return reject(errSet);
        }
        return resolve(newRefreshToken);
    });
});


module.exports = {
    generateAccessToken,
    generateRefreshToken,
    regenerateRefreshToken,
};
