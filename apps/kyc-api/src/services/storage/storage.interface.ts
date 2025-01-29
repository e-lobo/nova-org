export interface StorageService {
  uploadFile(file: Express.Multer.File, folder?: string): Promise<string>;

  deleteFile(filePath: string): Promise<void>;

  getFileStream(filePath: string): Promise<NodeJS.ReadableStream>;
}
