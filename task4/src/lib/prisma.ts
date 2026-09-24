import 'dotenv/config';
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const g = globalThis as unknown as { prisma?: PrismaClient };

function makeClient() {
  const adapter = new PrismaPg(
    { connectionString: process.env.DATABASE_URL! },
    { schema: 'book' }
  );
  return new PrismaClient({ adapter });
}

export const prisma = g.prisma ?? makeClient();
if (process.env.NODE_ENV !== 'production') g.prisma = prisma;