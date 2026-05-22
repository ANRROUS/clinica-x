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

  if (!existente) {
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
  } else {
    console.log('⚠️ Ya existe un usuario ADMIN. Seed omitido.');
  }

  // ─── Usuario TEST OCR ──────────────────────────────────────────────────
  const testDni = '99999999';
  const testEmail = 'andres.salesland@gmail.com';
  const testPassword = 'Andres123Clinica';

  const testExistente = await prisma.usuario.findUnique({
    where: { dni: testDni },
  });

  if (!testExistente) {
    const testPasswordHash = await bcrypt.hash(testPassword, 10);

    await prisma.usuario.create({
      data: {
        id: 'test-ocr-001',
        dni: testDni,
        email: testEmail,
        passwordHash: testPasswordHash,
        nombre: 'Test',
        apellido: 'OCR',
        telefono: null,
        rol: 'PACIENTE',
      },
    });

    console.log('✅ Usuario TEST OCR creado exitosamente:');
    console.log(`   DNI: ${testDni}`);
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: ${testPassword}`);
  } else {
    console.log('⚠️ Usuario TEST OCR ya existe. Seed omitido.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
