const User = require('./model');

exports.signUp = async (req, res) => {
  console.log('body: ', req.body);

  /* if (!req.body.email || !req.body.password) {
    return res.status(400).json({ msg: 'Please. Send your email and password' });
  }
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ msg: 'The user already exists' });
  } */
  const newUser = new User(req.body);
  await newUser.save();

  return res.status(201).json({ message: 'received' });
};
