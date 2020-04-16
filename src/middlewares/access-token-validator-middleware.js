const validator = require('validator');
const bcrypt = require('bcrypt');
const { routerWrapper } = require('../utils/express-util');
const UserRepository = require('../repositories/user-repository');
const logger = require('../utils/logger');
const InvalidRequest = require('../models/exceptions/invalid-request-exception');
const AuthorizationError = require('../models/exceptions/authorization-exception');


const accessTokenValidator = routerWrapper(async (req, res, next) => {
    const {
        grantType,
    } = req;
    // If grantType is not password , move to next middlware, and stop validating request
    if (grantType !== 'password') {
        return next();
    }
    logger.info('Starting to validate access token request');
    const userRepo = new UserRepository();
    const {
        username: rawUserName = '',
        password = '',
    } = req.body;

    const email = rawUserName.trim().toLowerCase();
    // Check request body
    if (!email || !password) {
        return next(new InvalidRequest('username and password is mandatory fields'));
    }
    if (!validator.isEmail(email)) {
        return next(new InvalidRequest('username is not valid'));
    }
    const user = await userRepo.findByEmail(email);
    if (!user) {
        return next(new InvalidRequest('User does not exist'));
    }
    logger.info('Starting to compare password for access token request');
    const result = await bcrypt.compare(password, user.getPassHash());
    if (!result) {
        return next(new AuthorizationError('Authorization failed'));
    }
    req.userId = user.getID();


    return next();
});


exports.accessTokenValidator = accessTokenValidator;
