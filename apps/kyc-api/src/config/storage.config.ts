import path from 'path';
import { env } from './env.config';

export const storageConfig = {
  uploadDir: path.join(__dirname, '../../uploads'),
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg'],
};
