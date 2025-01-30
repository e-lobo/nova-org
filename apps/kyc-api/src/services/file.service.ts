import { FileRepository } from '../repositories/file.repository';
import { LocalStorageService } from './storage/local-storage.service';
import { FileUploadDTO, FileMetadata } from '../types/file';
import { AppError } from '../middleware/error.middleware';
import { storageConfig } from '../config/storage.config';
import path from 'path';

export class FileService {
  constructor(
    private fileRepository: FileRepository,
    private storageService: LocalStorageService,
  ) {}

  private getMimeType(filePath: string): string {
    const extension = path.extname(filePath).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.jpg': 'image/jpg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.pdf': 'application/pdf',
    };

    return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
  }

  async uploadFile({
    file,
    userId,
    folder,
    kycId,
    documentType,
  }: FileUploadDTO): Promise<FileMetadata> {
    // Validate file size
    if (file.size > storageConfig.maxFileSize) {
      throw new AppError(400, 'File size exceeds limit');
    }

    // Validate mime type
    if (!storageConfig.allowedMimeTypes.includes(file.mimetype)) {
      throw new AppError(400, 'File type not allowed');
    }

    // Upload to storage
    const path = await this.storageService.uploadFile(file, folder);

    // Save metadata to database
    const fileData = await this.fileRepository.create({
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path,
      folder: folder || 'default',
      documentType,
      kyc: kycId ? { connect: { id: kycId } } : undefined,
      uploadedBy: { connect: { id: userId } },
    });

    return { ...fileData, uploadedBy: userId };
  }

  async deleteFile(fileId: string, userId: string): Promise<void> {
    const file = await this.fileRepository.findById(fileId);

    if (!file) {
      throw new AppError(404, 'File not found');
    }

    if (file.userId !== userId) {
      throw new AppError(403, 'Not authorized to delete this file');
    }

    // Delete from storage
    await this.storageService.deleteFile(file.path);

    // Delete from database
    await this.fileRepository.delete(fileId);
  }

  async getFile(
    fileId: string,
    userId: string,
    role: string,
  ): Promise<{ fileStream: NodeJS.ReadableStream; mimeType: string }> {
    const file = await this.fileRepository.findById(fileId);

    if (!file) {
      throw new AppError(404, 'File not found');
    }

    if (file.userId !== userId && role !== 'ADMIN') {
      throw new AppError(403, 'Not authorized to access this file');
    }

    // Determine mime type based on file extension
    const mimeType = this.getMimeType(file.path);
    const fileStream = await this.storageService.getFileStream(file.path);

    return { fileStream, mimeType };
  }

  async getUserFiles(userId: string): Promise<FileMetadata[]> {
    const r = await this.fileRepository.findUserFiles(userId);
    return r.map((file) => ({ ...file, uploadedBy: userId }));
  }
}
