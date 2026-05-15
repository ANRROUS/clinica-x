/**
 * ============================================================================
 * Seed inicial de Clínica X — Crea el usuario ADMIN
 * ============================================================================
 * El administrador no puede registrarse desde la plataforma.
 * Su cuenta se crea mediante este seed al desplegar el sistema.
 *
 * Uso:
 *   pnpm --filter auth-service seed
 *   o
 *   npx tsx prisma/seed.ts
 * ============================================================================
 */

import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminDni = '00000000';
  const adminEmail = 'admin@clinicax.com';
  const adminPassword = 'Admin123!'; // Cambiar en producción

  const existente = await prisma.usuario.findFirst({
    where: { rol: 'ADMIN' },
  });

  if (existente) {
    console.log('⚠️ Ya existe un usuario ADMIN. Seed omitido.');
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.usuario.create({
    data: {
      id: 'admin-seed-001',
      dni: adminDni,
      email: adminEmail,
      passwordHash,
      nombre: 'Administrador',
      apellido: 'Sistema',
      telefono: null,
      rol: 'ADMIN',
    },
  });

  console.log('✅ Usuario ADMIN creado exitosamente:');
  console.log(`   DNI: ${adminDni}`);
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log('   ⚠️ Cambia esta contraseña en producción');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
