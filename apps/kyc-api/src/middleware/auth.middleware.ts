import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware';
import { env } from '../config/env.config';
import { UserRepository } from '../repositories/user.repository';

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Get token
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AppError(401, 'Please login to access this resource');
    }

    // 2. Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };

    // 3. Check if user exists
    const userRepository = new UserRepository();
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      throw new AppError(401, 'User no longer exists');
    }

    // 4. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, 'Invalid token'));
      return;
    }
    next(error);
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    throw new AppError(403, 'Access denied. Admin only.');
  }
  next();
};
