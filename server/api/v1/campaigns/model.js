const mongoose = require('mongoose');

const campaign = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  img: { type: String, required: true },
  tags: {
    type: String,
    enum: ['In memorium', 'Salud', 'Mascotas', 'Otros'],
    required: true,
  },
  donations: { type: Number, default: 0 },
  goal: { type: Number, min: [50, 'must set 50 USD minimum'], required: true },
  name: { type: String, required: true },
  campaignReason: { type: String, required: true },
  commentsDb: { type: Array, default: [] },
  date: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

const model = mongoose.model('campaign', campaign);
module.exports = model;
