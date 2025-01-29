import pino from 'pino';
import { env, isDevelopment } from '../config/env.config';

export const logger = pino({
  level: env.LOG_LEVEL,
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l o',
        },
      }
    : undefined,
});

export default logger;
