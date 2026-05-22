import { prisma } from './shared/prisma-client';

async function main() {
  console.log('Connecting to database...');
  try {
    const medicos = await prisma.medico.findMany({
      where: { activo: true },
      include: { especialidad: true },
    });
    console.log(`Success! Found ${medicos.length} active doctors:`);
    for (const m of medicos) {
      console.log(`- Doctor: ${m.nombreUsuario}, Specialty: ${m.especialidad?.nombre} (ID: ${m.especialidadId})`);
    }
  } catch (err) {
    console.error('Error querying database:', err);
  } finally {
    await prisma.$disconnect();
    console.log('Disconnected.');
  }
}

main().catch(console.error);
