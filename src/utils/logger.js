import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logsDir = join(__dirname, '../logs');

if (!existsSync(logsDir)) {
  mkdirSync(logsDir, { recursive: true });
}

const { combine, timestamp, json, errors } = winston.format;

const pdTransport = new DailyRotateFile({
  filename: join(logsDir, 'pd-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxFiles: '548d',
  auditFile: join(logsDir, 'pd-audit.json'),
});

const errorTransport = new DailyRotateFile({
  filename: join(logsDir, 'errors-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxFiles: '365d',
  auditFile: join(logsDir, 'errors-audit.json'),
  level: 'error'
});

export const pdLogger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    json()
  ),
  transports: [
    pdTransport,
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  ]
});

export const errorLogger = winston.createLogger({
  level: 'error',
  format: combine(
    timestamp(),
    errors({ stack: true }),
    json()
  ),
  transports: [
    errorTransport,
    new winston.transports.Console()
  ]
});