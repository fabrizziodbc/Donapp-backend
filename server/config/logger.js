const winston = require('winston');
const morgan = require('morgan');
const stripFinalNewline = require('strip-final-newline');
const { v4: uuidv4 } = require('uuid');

const logger = winston.createLogger({
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});
const requestId = (req, res, next) => {
  const { headers } = req;
  const id = headers['X-Request-Id'] ?? uuidv4();
  req.id = id;
  next();
};
morgan.token('id', (req) => req.id);

const requestLog = morgan(
  ':remote-addr [:date[iso]] :id ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
  {
    stream: { write: (message) => logger.info(stripFinalNewline(message)) },
  },
);

module.exports = { logger, requestId, requestLog };
