import { KYCRepository } from '../repositories/kyc.repository';
import { FileRepository } from '../repositories/file.repository';
import { FileService } from '../services/file.service';
import { AppError } from '../middleware/error.middleware';
import { CreateKYCDTO, UpdateKYCStatusDTO, KYCDocumentDTO } from '../types/kyc';
import { KYC } from '@prisma/client';

export class KYCService {
  constructor(
    private kycRepository: KYCRepository,
    private fileService: FileService,
    private fileRepository: FileRepository,
  ) {}

  async createKYC(
    userId: string,
    data: CreateKYCDTO,
    documents: KYCDocumentDTO[],
  ): Promise<KYC | null> {
    const existingKYC = await this.kycRepository.findByUserId(userId);

    if (existingKYC && existingKYC.status === 'APPROVED') {
      throw new AppError(400, 'KYC already approved');
    }

    if (existingKYC && existingKYC.status === 'PENDING') {
      throw new AppError(400, 'KYC already submitted');
    }

    // Validate required document types
    const documentTypes = documents.map((doc) => doc.documentType);
    const requiredTypes = ['PASSPORT', 'ADDRESS_PROOF', 'SELFIE'];
    const missingTypes = requiredTypes.filter(
      (type) => !documentTypes.includes(type as any),
    );

    if (missingTypes.length > 0) {
      throw new AppError(
        400,
        `Missing required documents: ${missingTypes.join(', ')}`,
      );
    }

    let kyc: KYC;
    if (existingKYC) {
      kyc = await this.kycRepository.update(existingKYC.id, {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
        status: 'PENDING',
      });
    } else {
      // Create KYC record first
      kyc = await this.kycRepository.create({
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
        user: { connect: { id: userId } },
      });
    }

    // Upload and link documents
    for (const doc of documents) {
      await this.fileService.uploadFile({
        file: doc.file,
        userId,
        folder: `kyc/${userId}`,
        documentType: doc.documentType,
        kycId: kyc.id,
      });
    }

    return this.kycRepository.findById(kyc.id);
  }

  async updateKYCStatus(
    kycId: string,
    adminId: string,
    data: UpdateKYCStatusDTO,
  ): Promise<KYC> {
    const kyc = await this.kycRepository.findById(kycId);
    if (!kyc) {
      throw new AppError(404, 'KYC not found');
    }

    if (kyc.status === 'APPROVED') {
      throw new AppError(400, 'Cannot update approved KYC');
    }

    // delete all files if KYC is not approved or status is not changed to under review
    if (data.status !== 'APPROVED') {
      const files = await this.fileRepository.findUserFiles(kyc.userId);
      for (const file of files) {
        await this.fileService.deleteFile(file.id, kyc.userId);
      }
    }

    return this.kycRepository.update(kycId, {
      status: data.status,
      notes: data.notes,
      reviewedBy: { connect: { id: adminId } },
    });
  }

  async getUserKYC(userId: string): Promise<KYC | null> {
    return this.kycRepository.findByUserId(userId);
  }

  async getAllKYCs(params: {
    skip?: number;
    take?: number;
    status?: string;
  }): Promise<KYC[]> {
    return this.kycRepository.findAll({
      skip: params.skip,
      take: params.take,
      where: params.status ? { status: params.status as any } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }
}
