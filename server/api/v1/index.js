const express = require('express');
const campaigns = require('./campaigns/routes');
const userRouter = require('./user/routes');
const filesRouter = require('./files/routes');
const paymentRouter = require('./payment/routes');

const router = express.Router();
router.use('/campaigns', campaigns);
router.use('/user', userRouter);
router.use('/files', filesRouter);
router.use('/payment', paymentRouter);

module.exports = router;
