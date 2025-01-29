import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { env } from './config/env.config';
import { requestId } from './middleware/request-id.middleware';
import { errorHandler } from './middleware/error.middleware';
import routes from './routes';
import logger from './utils/logger';

export const createApp = (): Express => {
  const app = express();

  // Request ID middleware
  app.use(requestId);

  // Logging
  app.use(
    pinoHttp({
      logger,
      customProps: (req) => ({
        requestId: req.id,
      }),
    }),
  );

  // Security middleware
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: env.RATE_LIMIT_MAX_REQUESTS, // Limit each IP to x requests per windowMs
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Compression
  app.use(compression());

  // Routes
  app.use(routes);

  // Error handling
  app.use(errorHandler);

  return app;
};
