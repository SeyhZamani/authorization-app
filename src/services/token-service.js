const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const privateKey = fs.readFileSync(path.resolve(__dirname, '../../config/private.pem'));
const { ACCESS_TOKEN_EXPIRATION: expiration } = process.env;

const generateAccessToken = (user) => {
    if (!user || !user.id) {
        throw new Error('System can not generate token with undefined id');
    }
    const token = jwt.sign({
        userId: user.id,
        exp: Math.floor(Date.now() / 1000) + (parseInt(expiration, 10)),
    }, privateKey);
    return token;
};


module.exports = {
    generateAccessToken,
};
