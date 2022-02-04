/* eslint-disable import/no-unresolved */
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { Result } = require('express-validator');
const cors = require('cors');
const passportMiddleware = require('./config/passport');

const api = require('./api/v1');
const { logger, requestId, requestLog } = require('./config/logger');
const User = require('./api/v1/user/model');

const app = express();

// middlewares
app.use(requestId);
app.use(requestLog);
/* app.use(cors()); */

const whitelist = ['http://localhost:3000', 'https://fast-shelf-59848.herokuapp.com/'];
app.use(cors({
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('No permitido'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
}));
app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
passport.use(passportMiddleware);

// Routes
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
