/* eslint-disable linebreak-style */
/* eslint-disable no-const-assign */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
/* eslint-disable eqeqeq */
/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable linebreak-style */
/* eslint-disable quotes */
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require('uuid');
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

// function getTokenData(token) {
//   let data = null;
//   jwt.verify(token, config.jwtsecret, (err, decoded) => {
//     if (err) {
//       console.log('DataToken Error');
//     } else {
//       data = decoded;
//     }
//   });
//   return data;
// }

/**
 * Sign up new user
 * @param {Object} req
 * @param {Object} res
 * @returns new user
 */
exports.signUp = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(errors);
    }
    const { name, email, password } = req.body;
    let user = await User.findOne({ email }) || null;
    if (user !== null) {
      return res.json({
        msg: 'The user already exists',
      });
    }
    const code = uuidv4();
    console.log(code);
    user = new User({
      name, email, password, code,
    });
    const template = getTemplate(name, code);
    await sendEmail(email, "Confirmación de cuenta DonApp", template);
    await user.save();
    res.status(200).json({
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      token: createToken(user),
      msg: 'Registrado correctamente',
    });
  } catch (error) {
    console.log(error);
    return res.json({
      msg: "Confirmation user error",
    });
  }
};

/**
 * Sign in user
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns sign in msg
 */

exports.confirm = async (req, res) => {
  try {
    const { token } = req.params;
    console.log(token);
    console.log("codeconfirm", req.params);
    // const { user } = req;
    const user = await User.findOne({ code: token }) || null;
    console.log("user", user);
    if (user) {
      user.status = "VERIFIED";
      await user.save();
      return res.status(200).json({
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        token: createToken(user),
        msg: 'Registrado correctamente',
      });
    }
    if (user === null) {
      return res.json({
        success: false,
        msg: 'Usuario no existe',
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      msg: "Confirmation user error",
    });
  }
};

exports.signIn = async (req, res, next) => {
  try {
    console.log("body: ", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(errors);
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ msg: "The user does not exists" });
    }
    if (user.status !== "VERIFIED") {
      return res.status(401).send({
        msg: "Pending Account. Please Verify Your Email!",
      });
    }
    console.log(user);
    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
      return res.status(200).json({
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        token: createToken(user),
      });
    }
    return res.status(400).json({ msg: "The email or password are incorrect" });
  } catch (error) {
    console.log("error en singin", error);
    /* return res.json({
      msg: error,
    }); */
  }
};
exports.testdelete = async (req, res, next) => {
  try {
    await User.deleteOne({ email: 'cypressTest@fakemail.com' });
    res.status(200).json({ msg: 'User deleted' });
  } catch (error) {
    next(error);
  }
};
