/**
 * Singleton de PrismaClient para auth-service.
 * En Fase 0 el cliente apunta al schema `auth_service` pero todavía no hay
 * modelos. Cuando se agreguen, basta con regenerar (`prisma:generate`).
 */
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: ['warn', 'error'],
});

export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}
