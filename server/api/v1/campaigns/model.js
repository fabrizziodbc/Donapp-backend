const mongoose = require('mongoose');

const campaign = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  img: { type: String }, // , required: true
  country: { type: String, required: true },
  category: {
    type: String,
    enum: ['In memorium', 'Salud', 'Mascotas', 'Otros'],
    required: true,
  },
  donations: { type: Number, default: 0 },
  objetive: { type: Number, min: [50, 'must set 50 USD minimum'], required: true },
  name: { type: String, required: true },
  targetdate: { type: Date, required: true },
  commentsDb: { type: Array, default: [] },
  date: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
});

const model = mongoose.model('campaign', campaign);
module.exports = model;
