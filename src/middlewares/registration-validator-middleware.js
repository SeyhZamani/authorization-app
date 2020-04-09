const validator = require('validator');
const UserRepository = require('../repositories/user-repository');
const { routerWrapper } = require('../utils/express-util');
const logger = require('../utils/logger');
const InvalidRequest = require('../models/exceptions/invalid-request-exception');

const registrationValidator = routerWrapper(async (req, res, next) => {
    logger.info('Registration Request is being validated');
    const userRepo = new UserRepository();
    const { email: rawEmail = '', password = '' } = req.body;
    const email = rawEmail.trim().toLowerCase();
    // Check request body
    if (!email || !password) {
        return next(new InvalidRequest('Email and Password is mandatory fields'));
    }
    // Check email
    if (!validator.isEmail(email)) {
        return next(new InvalidRequest('Email is not valid'));
    }
    // [TO_DO] check password
    const user = await userRepo.findByEmail(email);
    if (user) {
        return next(new InvalidRequest('User already exists'));
    }
    req.email = email;
    req.password = password;
    return next();
});

exports.registrationValidator = registrationValidator;
