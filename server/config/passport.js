const { ExtractJwt, Strategy } = require('passport-jwt');
const config = require('./index');
const User = require('../api/v1/user/model');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtsecret,
};

module.exports = new Strategy(options, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    console.log(error);
    return false;
  }
});
