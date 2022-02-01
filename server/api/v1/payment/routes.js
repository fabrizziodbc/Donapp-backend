const express = require('express');
const passport = require('passport');
const { createCardTokenHandler, createCustomerHandler, createPaymentHandler } = require('./controller');

const router = express.Router();

router.post('/card-token', passport.authenticate('jwt', { session: true }), createCardTokenHandler);
router.post('/create-customer', passport.authenticate('jwt', { session: true }), createCustomerHandler);
router.post('/make-payment', passport.authenticate('jwt', { session: true }), createPaymentHandler);

module.exports = router;
