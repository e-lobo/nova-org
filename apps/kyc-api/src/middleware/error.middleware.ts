import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void => {
  if (err instanceof AppError) {
    logger.error({
      err,
      req: { id: req.id, method: req.method, url: req.url },
      isOperational: err.isOperational,
    });

    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      requestId: req.id,
    });
    return;
  }

  // Unexpected errors
  logger.error({
    err,
    req: { id: req.id, method: req.method, url: req.url },
    isOperational: false,
  });

  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    requestId: req.id,
  });
};
