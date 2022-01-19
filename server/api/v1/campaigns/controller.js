const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Model = require('./model');
const User = require('../user/model');

exports.id = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await Model.findById(id).select('-__v');
    if (!data) {
      const message = `${Model.name} not found`;
      next({ message, statuscode: 404, level: 'warn' });
    } else {
      req.doc = data;
      next();
    }
  } catch (error) {
    next(error);
  }
};
exports.all = async (req, res, next) => {
  try {
    const data = await Model.find({}).select('-__v');
    res.json({ data });
  } catch (error) {
    next(error);
  }
};
exports.create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors);
  }
  const { body = {} } = req;
  const newDocument = new Model(body);
  const user = await User.findById(body.user);
  if (!user) {
    return res.status(404).json({ msg: 'Could not find user for provided id' });
  }

  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      await newDocument.save({ session });
      await user.campaigns.push(newDocument);
      await user.save({ session });
    });
    await session.endSession();

    const status = 201;
    return res.status(status).json({ data: newDocument });
  } catch (error) {
    return next(error);
  }
};
exports.read = async (req, res, next) => {
  const { doc = {} } = req;
  res.json({ data: doc });
};
exports.update = async (req, res, next) => {
  const { doc = {}, body = {} } = req;
  console.log('doc', doc);
  console.log('body', body);
  if (body.title !== null && body.title !== undefined) {
    doc.title = body.title;
  }
  if (body.description !== null && body.description !== undefined) {
    doc.description = body.description;
  }
  if (body.img !== null && body.img !== undefined) {
    doc.img = body.img;
  }
  if (body.tags !== null && body.tags !== undefined) {
    doc.tags = body.tags;
  }
  if (body.donations !== null && body.donations !== undefined) {
    doc.donations = body.donations;
  }
  if (body.goal !== null && body.goal !== undefined) {
    doc.goal = body.goal;
  }
  if (body.name !== null && body.name !== undefined) {
    doc.name = body.name;
  }
  if (body.campaignReason !== null && body.campaignReason !== undefined) {
    doc.campaignReason = body.campaignReason;
  }
  try {
    console.log('doc', doc);
    const data = await doc.save();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};
exports.delete = async (req, res, next) => {
  const { id } = req.params;
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const campaign = await Model.findByIdAndDelete(id, {
        session,
      }).populate('user');
      console.log('campaign', campaign);
      await campaign.user.campaigns.pull(campaign);
      await campaign.user.save({ session });
    });
    session.endSession();
    res.status(200).json({ msg: 'Delete campaign' });
  } catch (error) {
    next(error);
  }
};
