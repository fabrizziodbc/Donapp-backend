const express = require('express');

const router = express.Router();
router
  .route('/')
  .get((req, res, next) => {
    res.json({ message: 'Estamos en user' });
  })
  .post((res, req, next) => {
    res.json({ message: 'creando usuario' });
  });

module.exports = router;
