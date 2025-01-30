import { Request, Response } from 'express';
import multer from 'multer';
import { FileService } from '../services/file.service';
import { FileRepository } from '../repositories/file.repository';
import { LocalStorageService } from '../services/storage/local-storage.service';
import { asyncHandler } from '../utils/async-handler';
import { AppError } from '../middleware/error.middleware';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const fileService = new FileService(
  new FileRepository(),
  new LocalStorageService(),
);

export const uploadFile = [
  upload.single('file'),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError(400, 'No file uploaded');
    }

    const file = await fileService.uploadFile({
      file: req.file,
      userId: req.user!.id,
      folder: req.body.folder,
    });

    res.status(201).json({
      status: 'success',
      data: file,
    });
  }),
];

export const deleteFile = asyncHandler(async (req: Request, res: Response) => {
  await fileService.deleteFile(req.params.fileId, req.user!.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const getFile = asyncHandler(async (req: Request, res: Response) => {
  const { fileStream, mimeType } = await fileService.getFile(
    req.params.fileId,
    req.user!.id,
    req.user!.role,
  );

  // Set the appropriate headers
  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Disposition', 'inline');

  fileStream.pipe(res);
});

export const getUserFiles = asyncHandler(
  async (req: Request, res: Response) => {
    const files = await fileService.getUserFiles(req.user!.id);

    res.status(200).json({
      status: 'success',
      data: files,
    });
  },
);
