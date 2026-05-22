import { PrismaClient } from './generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('--- ESPECIALIDADES ---');
  const especialidades = await prisma.especialidad.findMany();
  console.log(JSON.stringify(especialidades, null, 2));

  console.log('--- MEDICOS ---');
  const medicos = await prisma.medico.findMany({
    include: { especialidad: true, horarios: true }
  });
  console.log(JSON.stringify(medicos, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
