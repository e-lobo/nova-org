import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserRepository } from '../repositories/user.repository';
import { asyncHandler } from '../utils/async-handler';
import { SignupDTO, LoginDTO } from '../types/auth';
import { validateLoginInput, validateSignupInput } from '../utils/validators';
import { AppError } from '../middleware/error.middleware';

const authService = new AuthService(new UserRepository());

export const signup = asyncHandler(
  async (req: Request<object, object, SignupDTO>, res: Response) => {
    const validatedData = validateSignupInput(req.body);
    const result = await authService.signup(validatedData);

    res.status(201).json({
      status: 'success',
      data: result,
    });
  },
);

export const login = asyncHandler(
  async (req: Request<object, object, LoginDTO>, res: Response) => {
    const validatedData = validateLoginInput(req.body);
    const result = await authService.login(validatedData);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  },
);

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Please login to access this resource');
  }

  res.status(200).json({
    status: 'success',
    data: req.user,
  });
});
