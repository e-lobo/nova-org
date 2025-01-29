import { Router } from 'express';
import * as fileController from '../controllers/file.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect); // All file routes require authentication

router.post('/upload', fileController.uploadFile);
router.get('/my-files', fileController.getUserFiles);
router.get('/:fileId', fileController.getFile);
router.delete('/:fileId', fileController.deleteFile);

export default router;
