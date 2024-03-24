import 'winston-daily-rotate-file';
import winston from 'winston';
import { path } from 'app-root-path';
import { join } from 'path';

const logDir = join(path, 'logs');
const isDev = ['development', 'local'].includes(process.env['NODE_ENV'] ?? '');
const isTest = process.env['NODE_ENV'] === 'test';
const appName = process.env['APP_NAME'] ?? 'uim-api';

export default winston.createLogger({
  level: isDev ? 'debug' : 'info',
  defaultMeta: { service: appName },
  format: winston.format.combine(winston.format.simple(), winston.format.metadata(), winston.format.timestamp()),
  silent: isTest,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple(), winston.format.timestamp()),
    }),
    new winston.transports.DailyRotateFile({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/error`,
      filename: `%DATE%.error.log`,
      maxFiles: 30,
      handleExceptions: true,
      json: false,
      zippedArchive: true,
      silent: isTest,
    }),
    new winston.transports.DailyRotateFile({
      level: 'debug',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/debug`,
      filename: `%DATE%.debug.log`,
      maxFiles: 30,
      handleExceptions: true,
      json: false,
      zippedArchive: true,
      silent: isTest,
    }),
    new winston.transports.DailyRotateFile({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/info`,
      filename: `%DATE%.log`,
      maxFiles: 30,
      json: false,
      zippedArchive: true,
      silent: isTest,
    }),
    new winston.transports.DailyRotateFile({
      level: 'warn',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/warn`,
      filename: `%DATE%.log`,
      maxFiles: 30,
      json: false,
      zippedArchive: true,
      silent: isTest,
    }),
  ],
});
