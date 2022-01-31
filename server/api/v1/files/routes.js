const express = require('express');
const { cloudinary } = require('../../../utils/cloudinary');

const router = express.Router();

router.get('/', async (req, res) => {
  const { resources } = await cloudinary.search
    .expression('folder:dev_setups')
    .sort_by('public_id', 'desc')
    .max_results(30)
    .execute();

  const publicIds = resources.map((file) => file.public_id);
  res.send(publicIds);
});
router.post('/', async (req, res) => {
  try {
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: 'dev_setups',
    });
    /* console.log('uploadResponse :', uploadResponse); */
    res.json({ secureUrl: uploadResponse.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Something went wrong' });
  }
});

module.exports = router;
