const validator = require('validator');
const UserRepository = require('../repositories/user-repository');
const { routerWrapper } = require('../utils/express-util');
const logger = require('../utils/logger');
const InvalidRequest = require('../models/exceptions/invalid-request-exception');

const tokenValidator = routerWrapper(async (req, res, next) => {
    logger.info('Token Request is being validated');
    const userRepo = new UserRepository();
    const {
        grant_type: grantType,
        username: rawUserName = '',
        password = '',
        client_id,
        client_secret
    } = req.body;
    if (!grantType || grantType !== 'password') {
        return next(new InvalidRequest('Unsupported grant_type'));
    }
    // [TO-DO] add clint_id and clinet_secret
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
    req.username = email;
    req.password = password;
    req.user = user;
    return next();
});

exports.tokenValidator = tokenValidator;
