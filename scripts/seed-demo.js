/**
 * ============================================================================
 * Seed E2E de Clínica X — Datos demo para los 3 flujos
 * ============================================================================
 * Crea datos coherentes para probar:
 *   - Flujo paciente: registro → login → reservar cita → ver perfil
 *   - Flujo médico: login → calendario → iniciar consulta → finalizar
 *   - Flujo admin: login → dashboard → crear médico → editar → toggle estado
 *
 * Uso:
 *   node scripts/seed-demo.js
 *
 * Requisitos:
 *   - Los 5 servicios + frontend corriendo (pnpm dev)
 *   - Gateway en http://localhost:8080
 *   - Especialidades ya cargadas (pnpm --filter appointment-service seed)
 *   - Admin ya existente (pnpm --filter auth-service seed) o se crea aquí
 * ============================================================================
 */

const GW = process.env.GW_URL || 'http://localhost:8080';

async function fetchJson(url, opts = {}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  try {
    return { status: res.status, body: JSON.parse(text) };
  } catch {
    return { status: res.status, body: text };
  }
}

function log(step, status, ok, extra = '') {
  console.log(`  ${step}: HTTP ${status} | ${ok ? '\u2705' : '\u274c FAIL'} ${extra}`);
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('\n========================================');
  console.log('  Cl\u00ednica X — Seed E2E Demo');
  console.log('========================================\n');

  // =========================================================================
  // 1. LOGIN ADMIN (asume que ya existe por prisma seed)
  // =========================================================================
  console.log('\n--- 1. Login Admin ---');
  let r = await fetchJson(`${GW}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dni: '00000000',
      email: 'admin@clinicax.com',
      password: 'Admin123!',
    }),
  });

  if (!r.body.success && r.status !== 200) {
    console.log('  Admin no encontrado. Creando via Prisma seed...');
    console.log('  Ejecuta: pnpm --filter auth-service seed');
    console.log('  Luego vuelve a correr este script.\n');
    process.exit(1);
  }

  log('1.1 Login admin', r.status, r.body.success);
  const adminToken = r.body.data?.token;
  if (!adminToken) {
    console.log('  No se obtuvo token admin. Abortando.');
    process.exit(1);
  }

  // =========================================================================
  // 2. OBTENER ESPECIALIDADES
  // =========================================================================
  console.log('\n--- 2. Obtener especialidades ---');
  r = await fetchJson(`${GW}/api/appointments/specialties`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  log('2.1 Especialidades', r.status, r.body.success, `(${r.body.data?.length ?? 0} encontradas)`);
  const especialidades = r.body.data || [];
  const espMap = {};
  for (const esp of especialidades) {
    espMap[esp.nombre] = esp.id;
  }

  // =========================================================================
  // 3. CREAR MÉDICOS (5 médicos con horarios variados)
  // =========================================================================
  console.log('\n--- 3. Crear médicos ---');
  const medicos = [
    {
      nombre: 'María', apellido: 'García', dni: '10101010', email: 'maria.garcia@clinicax.com',
      telefono: '911123456', username: 'drGarcia', shift: 'MANANA',
      specialtyNombre: 'Medicina General',
      password: 'Medico123!',
      schedules: [
        { diaSemana: 1, horaInicio: '08:00', horaFin: '12:00' },
        { diaSemana: 2, horaInicio: '08:00', horaFin: '12:00' },
        { diaSemana: 3, horaInicio: '08:00', horaFin: '12:00' },
        { diaSemana: 4, horaInicio: '08:00', horaFin: '12:00' },
        { diaSemana: 5, horaInicio: '08:00', horaFin: '12:00' },
      ],
    },
    {
      nombre: 'Carlos', apellido: 'López', dni: '20202020', email: 'carlos.lopez@clinicax.com',
      telefono: '922234567', username: 'drLopez', shift: 'TARDE',
      specialtyNombre: 'Cardiología',
      password: 'Medico123!',
      schedules: [
        { diaSemana: 1, horaInicio: '14:00', horaFin: '18:00' },
        { diaSemana: 2, horaInicio: '14:00', horaFin: '18:00' },
        { diaSemana: 3, horaInicio: '14:00', horaFin: '18:00' },
        { diaSemana: 4, horaInicio: '14:00', horaFin: '18:00' },
        { diaSemana: 5, horaInicio: '14:00', horaFin: '18:00' },
      ],
    },
    {
      nombre: 'Ana', apellido: 'Martínez', dni: '30303030', email: 'ana.martinez@clinicax.com',
      telefono: '933345678', username: 'draMartinez', shift: 'MANANA',
      specialtyNombre: 'Dermatología',
      password: 'Medico123!',
      schedules: [
        { diaSemana: 1, horaInicio: '09:00', horaFin: '13:00' },
        { diaSemana: 3, horaInicio: '09:00', horaFin: '13:00' },
        { diaSemana: 5, horaInicio: '09:00', horaFin: '13:00' },
      ],
    },
    {
      nombre: 'Roberto', apellido: 'Sánchez', dni: '40404040', email: 'roberto.sanchez@clinicax.com',
      telefono: '944456789', username: 'drSanchez', shift: 'TARDE',
      specialtyNombre: 'Traumatología',
      password: 'Medico123!',
      schedules: [
        { diaSemana: 2, horaInicio: '15:00', horaFin: '19:00' },
        { diaSemana: 4, horaInicio: '15:00', horaFin: '19:00' },
      ],
    },
    {
      nombre: 'Laura', apellido: 'Fernández', dni: '50505050', email: 'laura.fernandez@clinicax.com',
      telefono: '955567890', username: 'draFernandez', shift: 'MANANA',
      specialtyNombre: 'Pediatría',
      password: 'Medico123!',
      schedules: [
        { diaSemana: 1, horaInicio: '08:30', horaFin: '12:30' },
        { diaSemana: 2, horaInicio: '08:30', horaFin: '12:30' },
        { diaSemana: 4, horaInicio: '08:30', horaFin: '12:30' },
      ],
    },
  ];

  const medicoIds = [];
  const medicoTokens = [];

  for (let i = 0; i < medicos.length; i++) {
    const m = medicos[i];
    const specialtyId = espMap[m.specialtyNombre];
    if (!specialtyId) {
      console.log(`  \u26a0 Especialidad "${m.specialtyNombre}" no encontrada, saltando médico ${m.nombre}`);
      continue;
    }

    r = await fetchJson(`${GW}/api/admin/doctors`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: m.nombre,
        apellido: m.apellido,
        dni: m.dni,
        email: m.email,
        telefono: m.telefono,
        username: m.username,
        specialtyId,
        shift: m.shift,
        password: m.password,
        schedules: m.schedules,
      }),
    });

    if (r.body.success) {
      const docId = r.body.data?.doctor?.id;
      medicoIds.push({ id: docId, username: m.username, specialty: m.specialtyNombre, shift: m.shift });
      log(`3.${i + 1} Crear ${m.nombre} ${m.apellido}`, r.status, true, `id=${docId}`);
    } else {
      const err = r.body.error?.mensaje || r.body.error?.detalles || JSON.stringify(r.body.error || r.body);
      log(`3.${i + 1} Crear ${m.nombre} ${m.apellido}`, r.status, false, err);
    }
  }

  // Verificar médicos existentes
  r = await fetchJson(`${GW}/api/admin/doctors`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const existingDoctors = r.body.data?.doctors || [];

  // =========================================================================
  // 4. LOGIN MÉDICOS
  // =========================================================================
  console.log('\n--- 4. Login médicos ---');
  for (const m of medicos) {
    r = await fetchJson(`${GW}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dni: m.dni, email: m.email, password: m.password }),
    });
    if (r.body.success) {
      medicoTokens.push({ token: r.body.data.token, dni: m.dni, username: m.username });
      log(`4.${medicos.indexOf(m) + 1} Login ${m.username}`, r.status, true);
    } else {
      log(`4.${medicos.indexOf(m) + 1} Login ${m.username}`, r.status, false);
    }
  }

  // =========================================================================
  // 5. CREAR PACIENTES (4 pacientes)
  // =========================================================================
  console.log('\n--- 5. Crear pacientes ---');
  const pacientes = [
    { nombre: 'Juan', apellido: 'Pérez', dni: '60606060', email: 'juan.perez@email.com', password: 'Paciente123!' },
    { nombre: 'Lucía', apellido: 'Rodríguez', dni: '70707070', email: 'lucia.rodriguez@email.com', password: 'Paciente123!' },
    { nombre: 'Pedro', apellido: 'Gómez', dni: '80808080', email: 'pedro.gomez@email.com', password: 'Paciente123!' },
    { nombre: 'Sofía', apellido: 'Torres', dni: '90909090', email: 'sofia.torres@email.com', password: 'Paciente123!' },
  ];

  const pacienteTokens = [];

  for (let i = 0; i < pacientes.length; i++) {
    const p = pacientes[i];

    // Registrar paciente
    r = await fetchJson(`${GW}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p),
    });

    if (r.body.success) {
      log(`5.${i + 1} Registrar ${p.nombre} ${p.apellido}`, r.status, true);

      // Login para obtener token
      r = await fetchJson(`${GW}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni: p.dni, email: p.email, password: p.password }),
      });

      if (r.body.success) {
        pacienteTokens.push({
          token: r.body.data.token,
          nombre: `${p.nombre} ${p.apellido}`,
          dni: p.dni,
          id: r.body.data.usuario?.id,
        });
        log(`5.${i + 1}b Login ${p.nombre}`, r.status, true);
      } else {
        log(`5.${i + 1}b Login ${p.nombre}`, r.status, false);
      }
    } else {
      const err = r.body.error?.mensaje || JSON.stringify(r.body.error || r.body);
      log(`5.${i + 1} Registrar ${p.nombre} ${p.apellido}`, r.status, false, err);
    }
  }

  // =========================================================================
  // 6. CREAR CITAS (citas entre pacientes y médicos)
  // =========================================================================
  console.log('\n--- 6. Crear citas de demo ---');
  const citasCreadas = [];

  if (pacienteTokens.length > 0 && medicoIds.length > 0) {
    const primerMedico = medicoIds[0];
    const segundoMedico = medicoIds.length > 1 ? medicoIds[1] : medicoIds[0];

    // Cita confirmada para paciente 1 con médico 1 (mañana)
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    const fechaManana = manana.toISOString().split('T')[0];

    // Cita para paciente 1 con médico 1
    if (primerMedico) {
      r = await fetchJson(`${GW}/api/appointments/book/manual`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pacienteTokens[0].token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medicoId: primerMedico.id,
          fechaHora: `${fechaManana}T08:30:00`,
          motivo: 'Consulta general',
        }),
      });
      if (r.body.success) {
        const cita = r.body.data?.appointment || r.body.data;
        citasCreadas.push(cita);
        log('6.1 Cita paciente1-medico1', r.status, true, `id=${cita?.id}`);
      } else {
        const err = r.body.error?.mensaje || JSON.stringify(r.body.error || r.body);
        log('6.1 Cita paciente1-medico1', r.status, false, err);
      }
    }

    // Cita para paciente 1 con médico 2
    if (segundoMedico && pacienteTokens[0]) {
      r = await fetchJson(`${GW}/api/appointments/book/manual`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pacienteTokens[0].token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medicoId: segundoMedico.id,
          fechaHora: `${fechaManana}T14:30:00`,
          motivo: 'Control cardiológico',
        }),
      });
      if (r.body.success) {
        const cita = r.body.data?.appointment || r.body.data;
        citasCreadas.push(cita);
        log('6.2 Cita paciente1-medico2', r.status, true, `id=${cita?.id}`);
      } else {
        const err = r.body.error?.mensaje || JSON.stringify(r.body.error || r.body);
        log('6.2 Cita paciente1-medico2', r.status, false, err);
      }
    }

    // Cita para paciente 2 con médico 1 (automática por especialidad)
    if (pacienteTokens.length > 1 && primerMedico) {
      r = await fetchJson(`${GW}/api/appointments/book/automatic`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pacienteTokens[1].token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          especialidadId: espMap['Medicina General'] || primerMedico.specialtyId,
          motivo: 'Chequeo rutinario',
        }),
      });
      if (r.body.success) {
        const cita = r.body.data?.appointment || r.body.data;
        citasCreadas.push(cita);
        log('6.3 Cita auto paciente2', r.status, true, `id=${cita?.id}`);
      } else {
        const err = r.body.error?.mensaje || JSON.stringify(r.body.error || r.body);
        log('6.3 Cita auto paciente2', r.status, false, err);
      }
    }

    // Cita para paciente 3 con médico 3 (dermatología)
    if (pacienteTokens.length > 2 && medicoIds.length > 2) {
      r = await fetchJson(`${GW}/api/appointments/book/manual`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pacienteTokens[2].token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medicoId: medicoIds[2].id,
          fechaHora: `${fechaManana}T09:30:00`,
          motivo: 'Revisión de piel',
        }),
      });
      if (r.body.success) {
        const cita = r.body.data?.appointment || r.body.data;
        citasCreadas.push(cita);
        log('6.4 Cita paciente3-medico3 (dermatología)', r.status, true, `id=${cita?.id}`);
      } else {
        const err = r.body.error?.mensaje || JSON.stringify(r.body.error || r.body);
        log('6.4 Cita paciente3-medico3 (dermatología)', r.status, false, err);
      }
    }
  }

  // =========================================================================
  // 7. CREAR CONSULTA ACTIVA (médico inicia consulta con paciente)
  // =========================================================================
  console.log('\n--- 7. Crear consulta activa ---');
  if (medicoTokens.length > 0 && citasCreadas.length > 0) {
    // Primero cambiar estado de cita a EN_ATENCION
    const primeraCita = citasCreadas[0];
    if (primeraCita?.id) {
      r = await fetchJson(`${GW}/api/appointments/doctor/${primeraCita.id}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${medicoTokens[0].token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: 'EN_ATENCION' }),
      });
      log('7.1 Cambiar cita a EN_Atencion', r.status, r.body.success);

      // Iniciar consulta
      r = await fetchJson(`${GW}/api/medical/doctor/consultation/start`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${medicoTokens[0].token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pacienteId: primeraCita.pacienteId || pacienteTokens[0]?.id,
          citaId: primeraCita.id,
          motivoConsulta: 'Consulta general - control rutinario',
        }),
      });
      if (r.body.success) {
        const consulta = r.body.data || r.body;
        log('7.2 Iniciar consulta', r.status, true, `id=${consulta?.id}`);

        // Finalizar consulta inmediatamente para tener datos completos
        if (consulta?.id) {
          r = await fetchJson(`${GW}/api/medical/doctor/consultation/${consulta.id}/finalize`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${medicoTokens[0].token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              diagnostico: 'Paciente sin hallazgos patológicos. Control normal.',
              notas: 'Se recomienda seguimiento en 6 meses. Signos vitales estables.',
            }),
          });
          log('7.3 Finalizar consulta', r.status, r.body.success);

          // Cambiar cita a COMPLETADA
          r = await fetchJson(`${GW}/api/appointments/doctor/${primeraCita.id}/status`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${medicoTokens[0].token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado: 'COMPLETADA' }),
          });
          log('7.4 Cita a COMPLETADA', r.status, r.body.success);
        }
      } else {
        const err = r.body.error?.mensaje || JSON.stringify(r.body.error || r.body);
        log('7.2 Iniciar consulta', r.status, false, err);
      }
    }
  }

  // =========================================================================
  // 8. CREAR UNA SEGUNDA CONSULTA FINALIZADA (para historial)
  // =========================================================================
  console.log('\n--- 8. Crear segunda consulta finalizada ---');
  if (medicoTokens.length > 1 && pacienteTokens.length > 1 && citasCreadas.length > 1) {
    const segundaCita = citasCreadas[1];
    if (segundaCita?.id) {
      // Cambiar a EN_ATENCION
      r = await fetchJson(`${GW}/api/appointments/doctor/${segundaCita.id}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${medicoTokens[1]?.token || medicoTokens[0]?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: 'EN_ATENCION' }),
      });
      log('8.1 Cita 2 a EN_ATENCION', r.status, r.body.success);

      // Iniciar consulta
      r = await fetchJson(`${GW}/api/medical/doctor/consultation/start`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${medicoTokens[1]?.token || medicoTokens[0]?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pacienteId: segundaCita.pacienteId || pacienteTokens[0]?.id,
          citaId: segundaCita.id,
          motivoConsulta: 'Control cardiológico',
        }),
      });
      if (r.body.success) {
        const consulta2 = r.body.data || r.body;
        log('8.2 Iniciar consulta 2', r.status, true, `id=${consulta2?.id}`);

        if (consulta2?.id) {
          r = await fetchJson(`${GW}/api/medical/doctor/consultation/${consulta2.id}/finalize`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${medicoTokens[1]?.token || medicoTokens[0]?.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              diagnostico: 'Hipertensión arterial leve. Se prescribe medicación.',
              notas: 'Presión arterial 140/90. Seguimiento en 1 mes.',
            }),
          });
          log('8.3 Finalizar consulta 2', r.status, r.body.success);

          r = await fetchJson(`${GW}/api/appointments/doctor/${segundaCita.id}/status`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${medicoTokens[1]?.token || medicoTokens[0]?.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado: 'COMPLETADA' }),
          });
          log('8.4 Cita 2 a COMPLETADA', r.status, r.body.success);
        }
      } else {
        const err = r.body.error?.mensaje || JSON.stringify(r.body.error || r.body);
        log('8.2 Iniciar consulta 2', r.status, false, err);
      }
    }
  }

  // =========================================================================
  // RESUMEN
  // =========================================================================
  console.log('\n========================================');
  console.log('  Seed E2E completado');
  console.log('========================================');
  console.log('\nCredenciales de demo:\n');
  console.log('  ADMIN:');
  console.log('    DNI: 00000000 | Email: admin@clinicax.com | Password: Admin123!');
  console.log('    Portal: http://localhost:3100/admin/login\n');

  console.log('  MÉDICOS:');
  for (const m of medicos) {
    console.log(`    DNI: ${m.dni} | Email: ${m.email} | Password: ${m.password} | User: ${m.username} | ${m.specialtyNombre} (${m.shift})`);
  }
  console.log('    Portal: http://localhost:3100/doctor/login\n');

  console.log('  PACIENTES:');
  for (const p of pacientes) {
    console.log(`    DNI: ${p.dni} | Email: ${p.email} | Password: ${p.password} | ${p.nombre} ${p.apellido}`);
  }
  console.log('    Portal: http://localhost:3100/login\n');

  console.log(`  Médicos creados: ${medicoIds.length}`);
  console.log(`  Pacientes creados: ${pacienteTokens.length}`);
  console.log(`  Citas creadas: ${citasCreadas.length}`);
  console.log('');
}

main().catch((err) => {
  console.error('\n\u274c Error en seed:', err);
  process.exit(1);
});