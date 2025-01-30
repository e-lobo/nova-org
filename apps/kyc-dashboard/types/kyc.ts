export interface KYCDocument {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  documentType: "PASSPORT" | "ADDRESS_PROOF" | "SELFIE";
  createdAt: string;
}

export interface KYCSubmission {
  id: string;
  userId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  phoneNumber: string;
  notes: string | null;
  reviewerId: string | null;
  createdAt: string;
  updatedAt: string;
  documents: KYCDocument[];
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  reviewedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
}
