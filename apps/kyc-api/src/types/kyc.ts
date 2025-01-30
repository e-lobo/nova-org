export interface CreateKYCDTO {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  phoneNumber: string;
}

export interface KYCDocumentDTO {
  documentType: 'PASSPORT' | 'ADDRESS_PROOF' | 'SELFIE';
  file: Express.Multer.File;
}

export interface UpdateKYCStatusDTO {
  status: 'PENDING' | 'RETURNED' | 'APPROVED' | 'REJECTED';
  notes?: string;
}

export interface KYCResponse {
  id: string;
  status: string;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  phoneNumber: string;
  documents: Array<{
    id: string;
    documentType: string;
    originalName: string;
    mimeType: string;
    path: string;
  }>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
