// // src/services/storage/s3-storage.service.ts
// import { S3 } from 'aws-sdk';
// import { StorageService } from './storage.interface';
// import { env } from '../../config/env.config';
//
// export class S3StorageService implements StorageService {
//   private s3: S3;
//
//   constructor() {
//     this.s3 = new S3({
//       accessKeyId: env.AWS_ACCESS_KEY_ID,
//       secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
//       region: env.AWS_REGION,
//     });
//   }
//
//   async uploadFile(file: Express.Multer.File, folder = 'default'): Promise<string> {
//     const key = `${folder}/${Date.now()}-${file.originalname}`;
//
//     await this.s3.upload({
//       Bucket: env.AWS_BUCKET_NAME,
//       Key: key,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     }).promise();
//
//     return key;
//   }
//
//   async deleteFile(filePath: string): Promise<void> {
//     await this.s3.deleteObject({
//       Bucket: env.AWS_BUCKET_NAME,
//       Key: filePath,
//     }).promise();
//   }
//
//   async getFileStream(filePath: string): Promise<NodeJS.ReadableStream> {
//     const { Body } = await this.s3.getObject({
//       Bucket: env.AWS_BUCKET_NAME,
//       Key: filePath,
//     }).promise();
//
//     return Body as NodeJS.ReadableStream;
//   }
// }
