const { PrismaClient } = require('./src/generated/prisma');
const p = new PrismaClient();
async function main() {
  const e = await p.especialidad.findMany({ take: 1 });
  const m = await p.medico.findMany({ include: { especialidad: true, horarios: true }, take: 1 });
  console.log(JSON.stringify({ especialidadId: e[0]?.id, medico: m[0] }, null, 2));
}
main().finally(() => p.$disconnect());
