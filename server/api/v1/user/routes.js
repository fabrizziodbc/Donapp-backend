const express = require('express');
const { body } = require('express-validator');
const passport = require('passport');
const userController = require('./controller');

const router = express.Router();

router.post(
  '/signup',
  body('name', 'Name is required').notEmpty(),
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
router.get('/special', passport.authenticate('jwt', { session: false }), (req, res) => res.status(200).json({ msg: 'success' }));

module.exports = router;
