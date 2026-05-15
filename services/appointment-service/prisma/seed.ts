/**
 * ============================================================================
 * Seed de especialidades para appointment-service
 * ============================================================================
 * Ejecutar con: pnpm --filter appointment-service seed
 * ============================================================================
 */

import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

const ESPECIALIDADES = [
  'Medicina General',
  'Cardiología',
  'Traumatología',
  'Dermatología',
  'Pediatría',
  'Neurología',
  'Ginecología',
  'Oftalmología',
  'Otorrinolaringología',
  'Endocrinología',
];

async function main(): Promise<void> {
  console.log('🌱 Seeding especialidades...');

  for (const nombre of ESPECIALIDADES) {
    await prisma.especialidad.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }

  const count = await prisma.especialidad.count();
  console.log(`✅ ${count} especialidades listas.`);
}

main()
  .catch((err) => {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
