import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validate-request.middleware';
import { signupSchema, loginSchema } from '../schemas/auth.schema';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post(
  '/signup',
  validateRequest(signupSchema), // Validate before reaching controller
  authController.signup,
);

router.post(
  '/login',
  validateRequest(loginSchema), // Validate before reaching controller
  authController.login,
);

router.get('/me', protect, authController.getMe);

export default router;
