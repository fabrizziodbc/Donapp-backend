const cloudinary = require('cloudinary').v2;
/* const config = require('../config/index'); */

/* cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret,
}); */

cloudinary.config({
  cloud_name: 'donapp',
  api_key: '664812659535518',
  api_secret: '5VJHClogpO_P439e2Yw7t_3DtTg',
});

module.exports = { cloudinary };
