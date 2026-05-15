const { PrismaClient } = require('./src/generated/prisma');
const p = new PrismaClient();
async function main() {
  const e = await p.especialidad.findFirst();
  if (e) console.log(e.id);
  else console.error('No hay especialidades');
  await p['$disconnect']();
}
main().catch(err => { console.error(err); process.exit(1); });
