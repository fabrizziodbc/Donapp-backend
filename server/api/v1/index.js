const express = require('express');
const campaigns = require('./campaigns/routes');

const router = express.Router();
router.use('/campaigns', campaigns);

module.exports = router;
