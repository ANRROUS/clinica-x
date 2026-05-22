import { PrismaClient } from '../generated/prisma';

export const prisma = new PrismaClient({
  log: ['warn', 'error'],
});

export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}
