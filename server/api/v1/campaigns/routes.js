const express = require('express');
const { body } = require('express-validator');
const controller = require('./controller');

const router = express.Router();

router
  .route('/')
  .get(controller.all)
  .post(
    body('title', 'Title is required!').notEmpty(),
    body('title', 'You exceeded the maximum characters (72)').isLength({
      max: 72,
    }),
    body('description', 'Description is required!').notEmpty(),
    body('description', 'You must use at least five (05) characters').isLength({
      min: 5,
    }),
    body('description', 'You exceeded the maximum characters (280)').isLength({
      max: 280,
    }),
    body('img', 'Image is required!').notEmpty(),
    body('tags', 'Tags are required!').notEmpty(),
    body('goal', 'Goal is required!').notEmpty(),
    body('name', 'Name is required!').notEmpty(),
    body('name', 'You must use at least five (05) characters').isLength({
      min: 5,
    }),
    body('campaignReason', 'Campaign reason is required!').notEmpty(),
    body(
      'campaignReason',
      'You must use at least five (05) characters',
    ).isLength({ min: 5 }),
    controller.create,
  );
router.param('id', controller.id);
router
  .route('/:id')
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete);

module.exports = router;
