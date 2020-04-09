const router = require('express').Router();
const bcrypt = require('bcrypt');
const { routerWrapper } = require('../utils/express-util');
const UserRepository = require('../repositories/user-repository');
const { generateBearerToken } = require('../services/token-service');
const logger = require('../utils/logger');

const { ACCESS_TOKEN_EXPIRATION: expiration } = process.env;


router.post('/', routerWrapper(async (req, res) => {
    logger.info('Starting process of registration');
    const userRepo = new UserRepository();
    const { email, password } = req;
    const { SALT_ROUND: saltRound } = process.env;
    const passHash = await bcrypt.hash(password, parseInt(saltRound, 10));
    const user = await userRepo.create(email, passHash);
    const token = generateBearerToken(user);
    return res.status(200).json({
        access_token: token,
        token_type: 'bearer',
        expires_in: expiration,
    });
}));

module.exports = router;
