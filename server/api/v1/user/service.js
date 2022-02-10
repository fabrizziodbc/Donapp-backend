/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
const { get } = require('lodash');
const User = require('./model');

async function updateUser(id, user) {
  const newUser = await User.findByIdAndUpdate(id, user, { new: true });
  return newUser;
}

async function addBillingCustomerId(user, customerId) {
  const creditCards = get(user, 'billing.creditCards', []);

  const customer = {
    billing: {
      creditCards,
      customerId,
    },
  };
  const newUser = await User.findByIdAndUpdate(user._id, customer, { new: true });
  return newUser;
}

module.exports = {
  updateUser,
  addBillingCustomerId,
};
