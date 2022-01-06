const express = require('express');
const { body } = require('express-validator');
const userController = require('./controller');

const router = express.Router();

router.post(
  '/signup',
  body('email', 'Email is required').notEmpty(),
  body('password', 'Password is required').notEmpty(),
  userController.signUp,
);
router.post(
  '/signin',
  body('email', 'Email is required').notEmpty(),
  body('password', 'Password is required').notEmpty(),
  userController.signIn,
);

module.exports = router;
