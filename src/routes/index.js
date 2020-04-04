const router = require('express').Router();
const signUpRouter = require('./sign-up-router');
const tokenRouter = require('./token-router');

router.use('/signup', signUpRouter);
router.use('/oauth/token', tokenRouter);

module.exports = router;
