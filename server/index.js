const express = require('express');
const { Result } = require('express-validator');

const api = require('./api/v1');
const { logger, requestId, requestLog } = require('./config/logger');

const app = express();

app.use(requestId);
app.use(requestLog);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', api);
app.use('/api/1', api);

app.use((req, res, next) => {
  const statusCode = 400;
  const message = 'Error. Route not found';
  logger.warn(message);
  next({ statusCode, message });
});
app.use((err, req, res, next) => {
  if (err instanceof Result) {
    return res.status(400).json({ errors: err.array() });
  }
  const { statusCode = 500, message = 'Unknown error ocurred!' } = err;
  logger.error(message);
  return res.status(statusCode).json({ message });
});

module.exports = app;
