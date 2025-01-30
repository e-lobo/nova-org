import { Request, Response } from 'express';
import multer from 'multer';
import { KYCService } from '../services/kyc.service';
import { KYCRepository } from '../repositories/kyc.repository';
import { FileService } from '../services/file.service';
import { FileRepository } from '../repositories/file.repository';
import { asyncHandler } from '../utils/async-handler';
import { AppError } from '../middleware/error.middleware';
import { KYCDocumentDTO } from '../types/kyc';
import { LocalStorageService } from '../services/storage/local-storage.service';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const kycService = new KYCService(
  new KYCRepository(),
  new FileService(new FileRepository(), new LocalStorageService()),
  new FileRepository(),
);

// Handle multiple file uploads for different document types
export const uploadFields = upload.fields([
  { name: 'passport', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 },
  { name: 'selfie', maxCount: 1 },
]);

export const submitKYC = [
  asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files.passport || !files.addressProof || !files.selfie) {
      throw new AppError(400, 'All required documents must be provided');
    }

    const documents: KYCDocumentDTO[] = [
      { documentType: 'PASSPORT', file: files.passport[0] },
      { documentType: 'ADDRESS_PROOF', file: files.addressProof[0] },
      { documentType: 'SELFIE', file: files.selfie[0] },
    ];

    const kyc = await kycService.createKYC(req.user!.id, req.body, documents);

    res.status(201).json({
      status: 'success',
      data: kyc,
    });
  }),
];

export const updateKYCStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const kyc = await kycService.updateKYCStatus(
      req.params.kycId,
      req.user!.id,
      req.body,
    );

    res.status(200).json({
      status: 'success',
      data: kyc,
    });
  },
);

export const getUserKYC = asyncHandler(async (req: Request, res: Response) => {
  const kyc = await kycService.getUserKYC(req.user!.id);

  res.status(200).json({
    status: 'success',
    data: kyc,
  });
});

export const getAllKYCs = asyncHandler(async (req: Request, res: Response) => {
  const kycs = await kycService.getAllKYCs({
    skip: Number(req.query.skip) || 0,
    take: Number(req.query.take) || 10,
    status: req.query.status as string,
  });

  res.status(200).json({
    status: 'success',
    data: kycs,
  });
});
