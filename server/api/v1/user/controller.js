/* eslint-disable linebreak-style */
/* eslint-disable quotes */
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("./model");
const config = require("../../../config");
const { getTemplate, sendEmail } = require("../../../config/mail");

/**
 * create token a user
 * @param {Object} user
 * @returns function sign
 */
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors);
  }
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ msg: "The user already exists" });
  }
  const newUser = new User(req.body);

  const template = getTemplate();

  await sendEmail(req.body.email, template);

  await newUser.save();

  return res.status(200).json({
    name: newUser.name,
    surname: newUser.surname,
    email: newUser.email,
    token: createToken(newUser),
  });
};

/**
 * Sign in user
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns sign in msg
 */
exports.signIn = async (req, res, next) => {
  console.log("body: ", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors);
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ msg: "The user does not exists" });
  }
  const isMatch = await user.comparePassword(req.body.password);
  if (isMatch) {
    return res.status(200).json({
      name: user.name,
      surname: user.surname,
      email: user.email,
      token: createToken(user),
    });
  }
  return res.status(400).json({ msg: "The email or password are incorrect" });
};
exports.testdelete = async (req, res, next) => {
  try {
    await User.deleteOne({ email: 'cypressTest@fakemail.com' });
    res.status(200).json({ msg: 'User deleted' });
  } catch (error) {
    next(error);
  }
};
