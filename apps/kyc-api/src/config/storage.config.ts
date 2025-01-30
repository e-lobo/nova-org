import path from 'path';

export const storageConfig = {
  uploadDir: path.join(__dirname, '../../uploads'),
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg'],
};
