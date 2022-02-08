/* eslint-disable linebreak-style */
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const creditCardSchema = new mongoose.Schema(
  {
    expMonth: {
      type: String,
      required: true,
      trim: true,
    },
    expYear: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mask: {
      type: String,
      required: true,
      trim: true,
    },
    tokenId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const billingSchema = new mongoose.Schema(
  {
    creditCards: [creditCardSchema],
    customerId: String,
  },
  { _id: false },
);

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    code: { type: String, required: true },
    status: { type: String, required: true, default: 'UNVERIFIED' },
    billing: billingSchema,
    campaigns: [
      {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: 'campaign',
      },
    ],
  },
  { timestamps: true },
);

/**
 * Password hash middleware
 */
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  return next();
});

/**
 * Helper method for validating user's password
 */
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
