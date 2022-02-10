/* eslint-disable no-underscore-dangle */
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Model = require('./model');
const User = require('../user/model');
const { cloudinary } = require('../../../utils/cloudinary');

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
    console.log('req.header :', req.headers.limit);
    /* console.log('req.headers NUmber :', parseInt(req.headers, 1)); */
    let data;
    if (!req.headers.limit) { data = await Model.find({}).select('-__v'); }
    if (req.headers.limit) {
      data = await Model.find({})
        .sort({ date: -1 })
        .limit(Number(req.headers.limit))
        .exec();
    }
    res.json({ data });
  } catch (error) {
    next(error);
  }
};
exports.getByUserId = async (req, res, next) => {
  try {
    const data = await User.findById(req.user._id)
      .select('-__v')
      .populate({ path: 'campaigns' });
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  console.log('req.use :', req.user);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors);
  }
  const { body = {} } = req;
  const newDocument = new Model({ ...body, user: req.user._id });
  const user = await User.findById(req.user._id);
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
  if (body.category !== null && body.category !== undefined) {
    doc.category = body.category;
  }
  if (body.donations !== null && body.donations !== undefined) {
    doc.donations = body.donations;
  }
  if (body.img !== null && body.img !== undefined) {
    doc.img = body.img;
  }
  if (body.objective !== null && body.objective !== undefined) {
    doc.objective = body.objective;
  }
  if (body.name !== null && body.name !== undefined) {
    doc.name = body.name;
  }
  if (body.country !== null && body.country !== undefined) {
    doc.country = body.country;
  }
  if (body.targetdate !== null && body.targetdate !== undefined) {
    doc.targetdate = body.targetdate;
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
    console.log('campaign id :', id);
    const imgUrl = await Model.findById(id).select('-__v');
    console.log(imgUrl.img);
    const session = await mongoose.startSession();
    const imgId = await imgUrl.img.split('upload/')[1].split('/')[1].split('.')[0];
    await session.withTransaction(async () => {
      const campaign = await Model.findByIdAndDelete(id, {
        session,
      }).populate('user');
      console.log('campaign', campaign);
      await campaign.user.campaigns.pull(campaign);
      await campaign.user.save({ session });
    });
    session.endSession();
    await cloudinary.uploader.destroy(imgId, (result) => { console.log(result); });
    res.status(200).json({ msg: 'Campaign deleted' });
  } catch (error) {
    next(error);
  }
};
