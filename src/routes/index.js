const router = require('express').Router();
const registrationRouter = require('./registration-router');
const tokenRouter = require('./token-router');
const { registrationValidator } = require('../middlewares/registration-validator-middleware');
const { tokenValidator } = require('../middlewares/token-validator-middleware');

router.use('/register', registrationValidator, registrationRouter);
router.use('/oauth/token', tokenValidator, tokenRouter);

module.exports = router;
