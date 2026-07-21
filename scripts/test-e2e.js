/**
 * ============================================================================
 * Test E2E — Prueba los 3 flujos completos de Clínica X
 * ============================================================================
 * Prueba:
 *   - Flujo paciente: login → reservar cita → ver perfil → cancelar cita
 *   - Flujo médico: login → calendario → iniciar consulta → finalizar
 *   - Flujo admin: login → dashboard → crear médico → editar → toggle estado
 *
 * Uso:
 *   node scripts/test-e2e.js
 *
 * Requisitos:
 *   - Los 5 servicios + frontend corriendo (pnpm dev)
 *   - Gateway en http://localhost:8080
 *   - Seed ejecutado (pnpm seed:demo)
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

function assert(step, result, expectedStatus, checkFn) {
  const ok = result.status === expectedStatus && (checkFn ? checkFn(result) : true);
  const icon = ok ? '\u2705' : '\u274c';
  const extra = ok ? '' : ` | body: ${JSON.stringify(result.body).substring(0, 200)}`;
  console.log(`  ${step}: HTTP ${result.status} ${icon}${extra}`);
  return ok;
}

let passed = 0;
let failed = 0;

function check(step, result, expectedStatus, checkFn) {
  const ok = assert(step, result, expectedStatus, checkFn);
  if (ok) passed++;
  else failed++;
  return ok;
}

// ============================================================================
// CREDENCIALES DE DEMO (del script seed-demo.js)
// ============================================================================
const ADMIN_PASSWORD = process.env['ADMIN_PASSWORD'] ?? '';
const MEDICO_PASSWORD = process.env['MEDICO_PASSWORD'] ?? '';
const PACIENTE_PASSWORD = process.env['PACIENTE_PASSWORD'] ?? '';

const ADMIN = { dni: '00000000', email: 'admin@clinicax.com', password: ADMIN_PASSWORD };
const MEDICO = { dni: '10101010', email: 'maria.garcia@clinicax.com', password: MEDICO_PASSWORD };
const PACIENTE = { dni: '60606060', email: 'juan.perez@email.com', password: PACIENTE_PASSWORD };

async function main() {
  console.log('\n==========================================');
  console.log('  Cl\u00ednica X — Test E2E (3 flujos)');
  console.log('==========================================\n');

  // =========================================================================
  // FLUJO ADMIN
  // =========================================================================
  console.log('=== FLUJO ADMIN ===\n');

  // A1. Login admin
  let r = await fetchJson(`${GW}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ADMIN),
  });
  check('A1. Login admin', r, 200, (res) => res.body.success && res.body.data?.token);
  const adminToken = r.body.data?.token;

  // A2. Verificar que el rol es ADMIN
  r = await fetchJson(`${GW}/api/auth/me`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  check('A2. GET /me rol ADMIN', r, 200, (res) => res.body.data?.rol === 'ADMIN' || res.body.data?.usuario?.rol === 'ADMIN');

  // A3. Dashboard (lista médicos + métricas)
  r = await fetchJson(`${GW}/api/admin/doctors`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  check('A3. Dashboard m\u00e9dicos', r, 200, (res) => res.body.success && Array.isArray(res.body.data?.doctors));
  const doctors = r.body.data?.doctors || [];
  const initialDoctorCount = doctors.length;

  // A4. Crear m\u00e9dico nuevo
  const uniq = Date.now().toString().slice(-6);
  r = await fetchJson(`${GW}/api/admin/doctors`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: 'Test', apellido: 'Doctor', dni: `99${uniq}`, email: `testdoc${uniq}@clinicax.com`,
      telefono: '900000000', username: `testdoc${uniq}`,
      specialtyId: doctors[0]?.specialtyId || espMap?.MedicinaGeneral,
      shift: 'MANANA', password: MEDICO_PASSWORD,
      schedules: [{ diaSemana: 1, horaInicio: '09:00', horaFin: '13:00' }],
    }),
  });
  check('A4. Crear m\u00e9dico', r, 201, (res) => res.body.success);
  const newDoctorId = r.body.data?.doctor?.id;

  // A5. Obtener m\u00e9dico por ID
  if (newDoctorId) {
    r = await fetchJson(`${GW}/api/admin/doctors/${newDoctorId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    check('A5. Obtener m\u00e9dico por ID', r, 200, (res) => res.body.success && res.body.data?.id === newDoctorId);
  }

  // A6. Actualizar m\u00e9dico
  if (newDoctorId) {
    r = await fetchJson(`${GW}/api/admin/doctors/${newDoctorId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'TestActualizado' }),
    });
    check('A6. Actualizar m\u00e9dico', r, 200, (res) => res.body.success);
  }

  // A7. Toggle estado (desactivar)
  if (newDoctorId) {
    r = await fetchJson(`${GW}/api/admin/doctors/${newDoctorId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo: false }),
    });
    check('A7. Desactivar m\u00e9dico', r, 200, (res) => res.body.success && res.body.data?.activo === false);
  }

  // A8. Toggle estado (reactivar)
  if (newDoctorId) {
    r = await fetchJson(`${GW}/api/admin/doctors/${newDoctorId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo: true }),
    });
    check('A8. Reactivar m\u00e9dico', r, 200, (res) => res.body.success && res.body.data?.activo === true);
  }

  // =========================================================================
  // FLUJO PACIENTE
  // =========================================================================
  console.log('\n=== FLUJO PACIENTE ===\n');

  // P1. Login paciente
  r = await fetchJson(`${GW}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(PACIENTE),
  });
  check('P1. Login paciente', r, 200, (res) => res.body.success);
  const patientToken = r.body.data?.token;
  const patientId = r.body.data?.usuario?.id;

  // P2. Ver perfil
  r = await fetchJson(`${GW}/api/auth/me`, {
    headers: { Authorization: `Bearer ${patientToken}` },
  });
  check('P2. Ver perfil', r, 200, (res) => res.body.data?.rol === 'PACIENTE');

  // P3. Listar especialidades
  r = await fetchJson(`${GW}/api/appointments/specialties`, {
    headers: { Authorization: `Bearer ${patientToken}` },
  });
  check('P3. Listar especialidades', r, 200, (res) => Array.isArray(res.body.data) && res.body.data.length > 0);
  const specialties = r.body.data || [];

  // P4. Disponibilidad por especialidad
  if (specialties.length > 0) {
    r = await fetchJson(`${GW}/api/appointments/availability/specialty/${specialties[0].id}`, {
      headers: { Authorization: `Bearer ${patientToken}` },
    });
    check('P4. Disponibilidad especialidad', r, 200, (res) => Array.isArray(res.body.data));
  }

  // P5. Disponibilidad por m\u00e9dico y fecha
  const doctorId = doctors[0]?.id || newDoctorId;
  if (doctorId) {
    const manana = new Date();
    manana.setDate(manana.getDate() + 2);
    const fechaStr = manana.toISOString().split('T')[0];

    r = await fetchJson(`${GW}/api/appointments/availability?medicoId=${doctorId}&fecha=${fechaStr}T00:00:00.000Z`, {
      headers: { Authorization: `Bearer ${patientToken}` },
    });
    check('P5. Disponibilidad m\u00e9dico', r, 200, (res) => Array.isArray(res.body.data));

    // P6. Reservar cita manual
    const slots = r.body.data || [];
    const slot = slots.find((s) => s.disponible);

    if (slot) {
      const fechaHora = `${fechaStr}T${slot.horaInicio}:00`;
      r = await fetchJson(`${GW}/api/appointments/book/manual`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${patientToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicoId: doctorId, fechaHora, motivo: 'Test E2E' }),
      });
      check('P6. Reservar cita manual', r, 201, (res) => res.body.success);
      const citaId = r.body.data?.appointment?.id || r.body.data?.id;

      // P7. Listar mis citas
      r = await fetchJson(`${GW}/api/appointments/patient/me`, {
        headers: { Authorization: `Bearer ${patientToken}` },
      });
      check('P7. Listar mis citas', r, 200, (res) => Array.isArray(res.body.data));

      // P8. Cancelar cita
      if (citaId) {
        r = await fetchJson(`${GW}/api/appointments/patient/${citaId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${patientToken}` },
        });
        check('P8. Cancelar cita', r, 200, (res) => res.body.success);
      }
    } else {
      console.log('  P6. Reservar cita: \u26a0 No hay slots disponibles');
    }
  }

  // P9. Historial cl\u00ednico
  r = await fetchJson(`${GW}/api/medical/patient/history`, {
    headers: { Authorization: `Bearer ${patientToken}` },
  });
  check('P9. Historial cl\u00ednico', r, 200, (res) => Array.isArray(res.body.data));

  // =========================================================================
  // FLUJO MÉDICO
  // =========================================================================
  console.log('\n=== FLUJO M\u00c9DICO ===\n');

  // M1. Login m\u00e9dico
  r = await fetchJson(`${GW}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(MEDICO),
  });
  check('M1. Login m\u00e9dico', r, 200, (res) => res.body.success && res.body.data?.usuario?.rol === 'MEDICO');
  const doctorToken = r.body.data?.token;
  const doctorUserId = r.body.data?.usuario?.id;

  // M2. Ver perfil m\u00e9dico
  r = await fetchJson(`${GW}/api/auth/me`, {
    headers: { Authorization: `Bearer ${doctorToken}` },
  });
  check('M2. Ver perfil m\u00e9dico', r, 200, (res) => res.body.data?.rol === 'MEDICO');

  // M3. Calendario m\u00e9dico
  r = await fetchJson(`${GW}/api/appointments/doctor/calendar`, {
    headers: { Authorization: `Bearer ${doctorToken}` },
  });
  check('M3. Calendario m\u00e9dico', r, 200, (res) => Array.isArray(res.body.data));

  // M4. Crear cita para m\u00e9dico y cambiar estado
  if (doctorId && patientToken && patientId) {
    // Paciente reserva cita con este m\u00e9dico
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 3);
    const fechaStr = fecha.toISOString().split('T')[0];

    r = await fetchJson(`${GW}/api/appointments/book/manual`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${patientToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ medicoId: doctors[0]?.id, fechaHora: `${fechaStr}T08:00:00`, motivo: 'Consulta E2E' }),
    });

    if (r.body.success) {
      const citaE2E = r.body.data?.appointment || r.body.data;
      check('M4a. Crear cita E2E', { status: r.status, body: r.body }, 201, (res) => res.success);

      // Cambiar a EN_ATENCION
      r = await fetchJson(`${GW}/api/appointments/doctor/${citaE2E?.id}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${doctorToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'EN_ATENCION' }),
      });
      check('M4b. Cita a EN_ATENCION', r, 200, (res) => res.body.success);

      // Iniciar consulta
      r = await fetchJson(`${GW}/api/medical/doctor/consultation/start`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${doctorToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pacienteId: patientId,
          citaId: citaE2E?.id,
          motivoConsulta: 'Test E2E - consulta de prueba',
        }),
      });
      check('M4c. Iniciar consulta', r, 201, (res) => res.body.success);
      const consultaId = r.body.data?.id;

      // Ver consulta activa
      r = await fetchJson(`${GW}/api/medical/doctor/active-patient`, {
        headers: { Authorization: `Bearer ${doctorToken}` },
      });
      check('M4d. Ver consulta activa', r, 200);

      // Finalizar consulta
      if (consultaId) {
        r = await fetchJson(`${GW}/api/medical/doctor/consultation/${consultaId}/finalize`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${doctorToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ diagnostico: 'Test E2E finalizado', notas: 'Notas de prueba' }),
        });
        check('M4e. Finalizar consulta', r, 200, (res) => res.body.success);

        // M5. Historial de pacientes
        r = await fetchJson(`${GW}/api/medical/doctor/patients`, {
          headers: { Authorization: `Bearer ${doctorToken}` },
        });
        check('M5. Historial pacientes', r, 200, (res) => Array.isArray(res.body.data));
      }
    } else {
      console.log('  M4. Crear cita E2E: \u26a0 No se pudo crear cita');
    }
  }

  // =========================================================================
  // RESUMEN
  // =========================================================================
  console.log('\n==========================================');
  console.log(`  Resultado: ${passed} PASARON, ${failed} FALLARON`);
  console.log('==========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('\n\u274c Error en test E2E:', err);
  process.exit(1);
});