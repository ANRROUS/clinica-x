const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  const especialidades = await prisma.especialidad.findMany();
  console.log('ESPECIALIDADES:', JSON.stringify(especialidades, null, 2));
  await prisma.$disconnect();
}

main().catch(console.error);
