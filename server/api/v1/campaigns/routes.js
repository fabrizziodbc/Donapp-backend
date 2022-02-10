const express = require('express');
const { body } = require('express-validator');
const passport = require('passport');
const controller = require('./controller');

const router = express.Router();

router
  .route('/')
  .get(controller.all)
  .post(
    passport.authenticate('jwt', { session: true }),
    body('title', 'Title is required!').notEmpty(),
    body('title', 'You exceeded the maximum characters (72)').isLength({
      max: 72,
    }),
    body('country', 'Country is required!').notEmpty(),
    body('description', 'Description is required!').notEmpty(),
    body('description', 'You must use at least five (10) characters').isLength({
      min: 10,
    }),
    body('description', 'You exceeded the maximum characters (280)').isLength({
      max: 280,
    }),
    /* body('img', 'Image is required!').notEmpty(), */
    body('category', 'Categories are required!').notEmpty(),
    body('objective', 'Goal is required!').notEmpty(),
    body('targetdate', 'Date limit is required!').notEmpty(),
    body('name', 'Name is required!').notEmpty(),
    body('name', 'You must use at least five (02) characters').isLength({
      min: 2,
    }),
    controller.create,
  );
router.route('/my-campaigns').get(passport.authenticate('jwt', { session: true }), controller.getByUserId);
router.param('id', controller.id);
router
  .route('/:id')
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete);

module.exports = router;
