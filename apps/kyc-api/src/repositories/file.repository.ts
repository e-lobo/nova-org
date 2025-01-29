import { File, Prisma } from '@prisma/client';
import prisma from '../db/client';

export class FileRepository {
  async create(data: Prisma.FileCreateInput): Promise<File> {
    return prisma.file.create({ data });
  }

  async findById(id: string) {
    return prisma.file.findUnique({
      where: { id },
    });
  }

  async findByFolder(folder: string): Promise<File[]> {
    return prisma.file.findMany({
      where: { folder },
    });
  }

  async delete(id: string): Promise<File> {
    return prisma.file.delete({
      where: { id },
    });
  }

  async findUserFiles(userId: string): Promise<File[]> {
    return prisma.file.findMany({
      where: { userId },
    });
  }
}
