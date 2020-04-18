const router = require('express').Router();
const registrationRouter = require('./registration-router');
const tokenRouter = require('./token-router');
const { registrationValidator } = require('../middlewares/registration-validator-middleware');
const { genericTokenValidatorMiddleware } = require('../middlewares/generic-token-validator-middleware');

router.use('/register', registrationValidator, registrationRouter);
router.use('/oauth/token', genericTokenValidatorMiddleware, tokenRouter);

module.exports = router;
