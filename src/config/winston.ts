import winston, { format, transports } from 'winston';

const options: winston.LoggerOptions = {
  level: 'debug',
  format: format.json(),
  transports: [
    new transports.Console({ level: 'debug' }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/debug.log', level: 'debug' }),
  ],
};

const logger = winston.createLogger(options);

export default logger;
