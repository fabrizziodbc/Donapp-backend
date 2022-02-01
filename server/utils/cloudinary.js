const cloudinary = require('cloudinary').v2;
const config = require('../config/index');

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

/* cloudinary.config({
  cloud_name: 'donapp',
  api_key: '664812659535518',
  api_secret: '5VJHClogpO_P439e2Yw7t_3DtTg',
}); */

module.exports = { cloudinary };
