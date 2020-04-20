const router = require('express').Router();
const bcrypt = require('bcrypt');
const moment = require('moment');
const avro = require('avsc');
const { routerWrapper } = require('../utils/express-util');
const UserRepository = require('../repositories/user-repository');
const { generateAccessToken, generateRefreshToken } = require('../services/token-service');
const logger = require('../utils/logger');
const kafkaService = require('../services/kafka-service');
const kafkaTopics = require('../models/kafka-topics');
const userCreatedSchema = require('../models/kafka-schemas/user-created-schema');

const { ACCESS_TOKEN_EXPIRATION: expiration } = process.env;
const type = avro.parse(userCreatedSchema);

router.post('/', routerWrapper(async (req, res) => {
    logger.info('Starting process of registration');
    const userRepo = new UserRepository();
    const { email, password } = req;
    const { SALT_ROUND: saltRound } = process.env;
    const passHash = await bcrypt.hash(password, parseInt(saltRound, 10));
    const user = await userRepo.create(email, passHash);
    await kafkaService.sendMessage([{
        topic: kafkaTopics.USER_CREATED,
        messages: type.toBuffer({
            id: user.getID(),
        }),
        attributes: 0,
        timestamp: moment.utc(),
    }]);
    const accessToken = await generateAccessToken(user.getID());
    const refreshToken = await generateRefreshToken(user.getID());
    return res.status(200).json({
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: 'bearer',
        expires_in: expiration,
    });
}));

module.exports = router;
