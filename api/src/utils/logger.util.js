'use strict';

const { createLogger, format, transports } = require('winston');
const winstonDaily = require('winston-daily-rotate-file');

const { combine, timestamp, printf, prettyPrint, colorize, json, errors } = format;

let level;

switch (process.env.NODE_ENV) {
  case 'production':
    level = 'info';
    break;
  case 'test':
    level = 'error';
    break;
  default:
    level = 'debug';
}

// winston console 설정
const consoleOutputFormat = combine(
  colorize(),
  prettyPrint(),
  json(),
  printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
  }),
);

// winston 설정
const options = {
  level,
  exitOnError: false,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    prettyPrint(),
    json(),
    printf(info => {
      return `${info.timestamp} ${info.level}: ${info.message}`;
    }),
  ),
  transports: [
    new transports.Console({
      handleExceptions: true,
      format: consoleOutputFormat,
    }),
  ],
};

const logger = createLogger(options);

// logs file 저장 설정
if (process.env.NODE_ENV === 'production') {
  logger.add(
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: 'logs/error',
      filename: `%DATE%.error.log`,
      maxFiles: 7,
    }),
    new winstonDaily({
      level: 'debug',
      datePattern: 'YYYY-MM-DD',
      dirname: 'logs/debug',
      filename: `%DATE%.debug.log`,
      maxFiles: 7,
    }),
  );
}

module.exports = { logger };
