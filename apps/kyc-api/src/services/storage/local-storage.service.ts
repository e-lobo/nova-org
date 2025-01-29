import fs from 'fs/promises';
import path from 'path';
import { createReadStream } from 'fs';
import { StorageService } from './storage.interface';
import { AppError } from '../../middleware/error.middleware';
import { storageConfig } from '../../config/storage.config';

export class LocalStorageService implements StorageService {
  async uploadFile(
    file: Express.Multer.File,
    folder = 'default',
  ): Promise<string> {
    const uploadDir = path.join(storageConfig.uploadDir, folder);

    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(folder, fileName);
    const fullPath = path.join(storageConfig.uploadDir, filePath);

    await fs.writeFile(fullPath, file.buffer);

    return filePath;
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(storageConfig.uploadDir, filePath);
    try {
      await fs.unlink(fullPath);
    } catch (error) {
      throw new AppError(404, 'File not found');
    }
  }

  async getFileStream(filePath: string): Promise<NodeJS.ReadableStream> {
    const fullPath = path.join(storageConfig.uploadDir, filePath);
    try {
      await fs.access(fullPath);
      return createReadStream(fullPath);
    } catch (error) {
      throw new AppError(404, 'File not found');
    }
  }
}
