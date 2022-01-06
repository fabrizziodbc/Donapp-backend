const express = require('express');
const campaigns = require('./campaigns/routes');
const userRouter = require('./user/routes');

const router = express.Router();
router.use('/campaigns', campaigns);
router.use('/user', userRouter);

module.exports = router;
