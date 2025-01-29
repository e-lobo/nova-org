export interface FileMetadata {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FileUploadDTO {
  file: Express.Multer.File;
  userId: string;
  folder?: string;
}
