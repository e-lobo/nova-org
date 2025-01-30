import { KYC, Prisma } from '@prisma/client';
import prisma from '../db/client';

export class KYCRepository {
  async create(data: Prisma.KYCCreateInput): Promise<KYC> {
    return prisma.kYC.create({
      data,
      include: {
        documents: true,
        reviewedBy: true,
      },
    });
  }

  async findByUserId(userId: string): Promise<KYC | null> {
    return prisma.kYC.findUnique({
      where: { userId },
      include: {
        documents: true,
        reviewedBy: true,
      },
    });
  }

  async findById(id: string): Promise<KYC | null> {
    return prisma.kYC.findUnique({
      where: { id },
      include: {
        documents: true,
        reviewedBy: true,
      },
    });
  }

  async update(id: string, data: Prisma.KYCUpdateInput): Promise<KYC> {
    return prisma.kYC.update({
      where: { id },
      data,
      include: {
        documents: true,
        reviewedBy: true,
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.KYCWhereInput;
    orderBy?: Prisma.KYCOrderByWithRelationInput;
  }): Promise<KYC[]> {
    const { skip, take, where, orderBy } = params;
    return prisma.kYC.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        documents: true,
        user: true,
        reviewedBy: true,
      },
    });
  }
}
