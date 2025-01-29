import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import fileRoutes from './file.routes';

const router = Router();

router.use('/api/v1', healthRoutes);
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/files', fileRoutes);

export default router;
