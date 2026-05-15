/**
 * Obtener IDs reales de la BD para pruebas E2E
 */
const { PrismaClient } = require('./services/appointment-service/src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const especialidades = await prisma.especialidad.findMany({ take: 1 });
  const medicos = await prisma.medico.findMany({ include: { especialidad: true, horarios: true }, take: 1 });
  console.log(JSON.stringify({
    especialidadId: especialidades[0]?.id || null,
    medico: medicos[0] || null,
  }, null, 2));
}

main().finally(() => prisma.$disconnect());
