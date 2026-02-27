const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

// Create logger
const logger = createLogger({
  level: 'info', // minimum level to log
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    colorize(),
    logFormat
  ),
  transports: [
    new transports.Console(), // log to console
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // only errors
    new transports.File({ filename: 'logs/combined.log' }), // all logs
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' }) // uncaught exceptions
  ],
});
module.exports = logger;
