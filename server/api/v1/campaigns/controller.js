const { validationResult } = require('express-validator');
const Model = require('./model');

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
  try {
    const data = await newDocument.save();
    const status = 201;
    return res.status(status).json({ data });
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
  const { doc = {} } = req;
  try {
    const data = await doc.remove();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};
