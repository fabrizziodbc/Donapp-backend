const mongoose = require('mongoose');
const { logger } = require('./config/logger');

const connect = ({
  username, password, databaseName, url = '',
}, options = {}) => {
  const encodedPassword = encodeURIComponent(password);
  // const databaseName = 'donapp';
  let dburl;
  if (username !== undefined && password !== undefined) {
    dburl = `mongodb+srv://${username}:${encodedPassword}@cluster0.mcika.mongodb.net/${databaseName}?retryWrites=true&w=majority`;
    logger.info('Connected from MongoAtlas');
  } else {
    dburl = `mongodb://${url}`;
    logger.info('Connected from Local');
  }

  mongoose.connect(dburl, {
    ...options,
  });

  mongoose.connection.on('connected', () => {
    logger.info('Database connected');
  });
  mongoose.connection.on('close', () => {
    logger.info('Database disconnected');
  });
  mongoose.connection.on('error', (error) => {
    logger.error(`Database error: ${error}`);
  });
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      logger.info('Database disconnected, becouse app termination');
      process.exit(0);
    });
  });
};

const disconnect = () => {
  mongoose.connection.close(() => {
    logger.info('Database disconnected successfully');
  });
};

module.exports = { connect, disconnect };
