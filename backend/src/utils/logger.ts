import winston from 'winston';
import { config } from '../config/config';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const devFormat = printf(({ level, message, timestamp, stack }) => {
  const ts = (timestamp as string).replace('T', ' ').substring(0, 19);
  if (stack) {
    return `[${ts}] ${level}: ${message}\n${stack as string}`;
  }
  return `[${ts}] ${level}: ${message as string}`;
});

const prodFormat = combine(timestamp(), errors({ stack: true }), winston.format.json());

const logger = winston.createLogger({
  level: config.nodeEnv === 'production' ? 'info' : 'debug',
  format:
    config.nodeEnv === 'production'
      ? prodFormat
      : combine(colorize(), timestamp(), errors({ stack: true }), devFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5,
    }),
    ...(config.nodeEnv === 'production'
      ? [
          new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880,
            maxFiles: 5,
          }),
        ]
      : []),
  ],
});

export default logger;
