import { PrismaClient, Prisma } from '../generated/prisma';

export { Prisma };
export const prisma = new PrismaClient({
  log: ['warn', 'error'],
});

export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}
