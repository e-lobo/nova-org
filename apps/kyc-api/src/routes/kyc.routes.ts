import { Router } from 'express';
import * as kycController from '../controllers/kyc.controller';
import { protect } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate-request.middleware';
import { createKYCSchema, updateKYCStatusSchema } from '../schemas/kyc.schema';
import { isAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(protect); // All KYC routes require authentication

router.post(
  '/submit',
  kycController.uploadFields,
  validateRequest(createKYCSchema),
  kycController.submitKYC,
);

router.get('/my-kyc', kycController.getUserKYC);

// Admin routes
router.use(isAdmin); // Following routes require admin access
router.get('/', kycController.getAllKYCs);
router.patch(
  '/:kycId/status',
  validateRequest(updateKYCStatusSchema),
  kycController.updateKYCStatus,
);

export default router;
