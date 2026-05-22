import pino from 'pino';
import { env } from '../env';

const isProd = env.NODE_ENV === 'production';
const SERVICE_NAME = 'appointment-service';
const LOG_TO_FILE = process.env.LOG_TO_FILE === 'true';

export const logger = pino({
  level: isProd ? 'info' : 'debug',
  transport: isProd
    ? LOG_TO_FILE
      ? {
          targets: [
            {
              target: 'pino/file',
              options: { destination: 1 },
              level: 'info',
            },
            {
              target: 'pino-roll',
              options: {
                file: `./logs/${SERVICE_NAME}.log`,
                frequency: 'daily',
                size: '10m',
                limit: { count: 7 },
              },
              level: 'info',
            },
            {
              target: 'pino-roll',
              options: {
                file: `./logs/${SERVICE_NAME}.err.log`,
                frequency: 'daily',
                size: '10m',
                limit: { count: 30 },
              },
              level: 'error',
            },
          ],
        }
      : undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:HH:MM:ss',
          ignore: 'pid,hostname',
        },
      },
  serializers: {
    err: pino.stdSerializers.err,
  },
  base: {
    service: SERVICE_NAME,
    env: env.NODE_ENV,
  },
});
