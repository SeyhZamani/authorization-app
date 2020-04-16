const router = require('express').Router();
const registrationRouter = require('./registration-router');
const tokenRouter = require('./token-router');
const { registrationValidator } = require('../middlewares/registration-validator-middleware');
const { accessTokenValidator } = require('../middlewares/access-token-validator-middleware');
const { refreshTokenValidator } = require('../middlewares/refresh-token-validator-middleware');
const { grantTypeChecker } = require('../middlewares/grant-type-checker-middleware');

router.use('/register', registrationValidator, registrationRouter);
router.use('/oauth/token', grantTypeChecker, accessTokenValidator, refreshTokenValidator, tokenRouter);

module.exports = router;
