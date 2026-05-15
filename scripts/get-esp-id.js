const { PrismaClient } = require('./services/appointment-service/src/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  const esp = await prisma.especialidad.findFirst();
  if (esp) {
    console.log(esp.id);
  } else {
    console.error('No hay especialidades');
    process.exit(1);
  }
  await prisma.$disconnect();
}

main().catch(console.error);
