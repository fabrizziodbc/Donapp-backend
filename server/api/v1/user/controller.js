const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('./model');
const config = require('../../../config');

function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, config.jwtsecret, {
    expiresIn: 86400,
  });
}

/**
 * Sign up new user
 * @param {Object} req
 * @param {Object} res
 * @returns new user
 */
exports.signUp = async (req, res, next) => {
  console.log('body: ', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors);
  }
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ msg: 'The user already exists' });
  }
  const newUser = new User(req.body);
  await newUser.save();

  return res.status(201).json({ message: 'received' });
};

exports.signIn = async (req, res, next) => {
  console.log('body: ', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors);
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ msg: 'The user does not exists' });
  }
  const isMatch = await user.comparePassword(req.body.password);
  if (isMatch) {
    return res.status(200).json({ user, token: createToken(user) });
  }
  return res.status(400).json({ msg: 'The email or password are incorrect' });
};
