import { Router } from 'express';
import * as healthController from '../controllers/health.controller';

const router = Router();

router.get('/health', healthController.healthCheck);

export default router;
