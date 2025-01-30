import { PrismaClient } from '@prisma/client';
import logger from '../src/utils/logger';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {
      password: await bcrypt.hash('admin', 12),
    },
    create: {
      email: 'admin@admin.com',
      name: 'Admin User',
      password: await bcrypt.hash('admin', 12),
      role: 'ADMIN',
    },
  });

  logger.info('Seed data created:', { admin });
}

main()
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
