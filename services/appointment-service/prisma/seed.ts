/**
 * ============================================================================
 * Seed de especialidades y médicos de prueba para appointment-service
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
];

const MEDICOS = [
  {
    nombreUsuario: 'dra.alva',
    especialidad: 'Medicina General',
    turno: 'MANANA' as const,
    horarios: [
      { diaSemana: 1, horaInicio: '08:00', horaFin: '12:00', duracionSlot: 30 },
      { diaSemana: 2, horaInicio: '08:00', horaFin: '12:00', duracionSlot: 30 },
      { diaSemana: 3, horaInicio: '08:00', horaFin: '12:00', duracionSlot: 30 },
      { diaSemana: 4, horaInicio: '08:00', horaFin: '12:00', duracionSlot: 30 },
      { diaSemana: 5, horaInicio: '08:00', horaFin: '12:00', duracionSlot: 30 },
    ],
  },
  {
    nombreUsuario: 'dr.pineda',
    especialidad: 'Medicina General',
    turno: 'TARDE' as const,
    horarios: [
      { diaSemana: 1, horaInicio: '14:00', horaFin: '18:00', duracionSlot: 30 },
      { diaSemana: 2, horaInicio: '14:00', horaFin: '18:00', duracionSlot: 30 },
      { diaSemana: 3, horaInicio: '14:00', horaFin: '18:00', duracionSlot: 30 },
      { diaSemana: 4, horaInicio: '14:00', horaFin: '18:00', duracionSlot: 30 },
      { diaSemana: 5, horaInicio: '14:00', horaFin: '18:00', duracionSlot: 30 },
    ],
  },
  {
    nombreUsuario: 'dra.cardio',
    especialidad: 'Cardiología',
    turno: 'MANANA' as const,
    horarios: [
      { diaSemana: 1, horaInicio: '09:00', horaFin: '13:00', duracionSlot: 30 },
      { diaSemana: 3, horaInicio: '09:00', horaFin: '13:00', duracionSlot: 30 },
      { diaSemana: 5, horaInicio: '09:00', horaFin: '13:00', duracionSlot: 30 },
    ],
  },
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

  const espCount = await prisma.especialidad.count();
  console.log(`✅ ${espCount} especialidades listas.`);

  for (const medicoData of MEDICOS) {
    const existing = await prisma.medico.findUnique({
      where: { nombreUsuario: medicoData.nombreUsuario },
    });

    if (existing) {
      console.log(`⏩ Médico ${medicoData.nombreUsuario} ya existe. Saltando.`);
      continue;
    }

    const especialidad = await prisma.especialidad.findUnique({
      where: { nombre: medicoData.especialidad },
    });

    if (!especialidad) {
      console.warn(`⚠️ Especialidad "${medicoData.especialidad}" no encontrada. Saltando médico ${medicoData.nombreUsuario}.`);
      continue;
    }

    const medico = await prisma.medico.create({
      data: {
        nombreUsuario: medicoData.nombreUsuario,
        especialidadId: especialidad.id,
        turno: medicoData.turno,
        activo: true,
      },
    });

    await prisma.horarioMedico.createMany({
      data: medicoData.horarios.map((h) => ({
        medicoId: medico.id,
        diaSemana: h.diaSemana,
        horaInicio: h.horaInicio,
        horaFin: h.horaFin,
        duracionSlot: h.duracionSlot,
      })),
    });

    console.log(`✅ Médico ${medicoData.nombreUsuario} creado con ${medicoData.horarios.length} horarios.`);
  }

  const medicoCount = await prisma.medico.count();
  console.log(`✅ Total médicos: ${medicoCount}`);
}

main()
  .catch((err) => {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });