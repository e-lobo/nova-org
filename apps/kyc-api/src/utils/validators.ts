import { z } from 'zod';
import { SignupDTO, LoginDTO } from '../types/auth';

const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string(),
});

export const validateSignupInput = (data: unknown): SignupDTO => {
  return signupSchema.parse(data);
};

export const validateLoginInput = (data: unknown): LoginDTO => {
  return loginSchema.parse(data);
};
