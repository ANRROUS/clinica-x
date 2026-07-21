/**
 * Script E2E robusto para Fase 3 — usa IDs reales de la BD
 */

const GW = 'http://localhost:8080';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';
const PACIENTE_PASSWORD = process.env.PACIENTE_PASSWORD || 'Paciente123!';
const MEDICO_PASSWORD = process.env.MEDICO_PASSWORD || 'Medico123!';

async function fetchJson(url, opts = {}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  try { return { status: res.status, body: JSON.parse(text) }; }
  catch { return { status: res.status, body: text }; }
}

function log(step, status, ok, extra = '') {
  console.log(`${step}: HTTP ${status} | ${ok ? '✅ OK' : '❌ FAIL'} ${extra}`);
}

async function main() {
  console.log('=== PRUEBAS E2E FASE 3 ===\n');

  // IDs reales obtenidos de la BD
  const specialtyId = '4c2dceed-452d-41e0-933b-a55c6cc70c8c'; // Medicina General
  const existingDoctorId = 'b1f839b7-c2fb-4351-b955-9309ed0c5629';

  // Fecha próximo lunes (día 1 = Lunes) para que haya slots
  const lunes = new Date('2026-05-19T00:00:00.000Z');
  const fechaStr = lunes.toISOString().split('T')[0];

  // 1. Login admin
  let r = await fetchJson(`${GW}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dni: '00000000', email: 'admin@clinicax.com', password: ADMIN_PASSWORD }),
  });
  log('1. Login admin', r.status, r.body.success);
  const adminToken = r.body.data?.token;

  // 2. Disponibilidad por especialidad
  r = await fetchJson(`${GW}/api/appointments/availability/specialty/${specialtyId}`, {
    headers: { Authorization: `Bearer ${adminToken}` }, // admin tiene token válido
  });
  log('2. Disp especialidad', r.status, r.body.success, `doctores=${r.body.data?.length ?? 0}`);
  // Nota: usamos adminToken temporalmente para ver qué retorna; endpoint requiere PACIENTE pero probamos

  // 3. Registrar paciente único
  const uniq = Date.now().toString().slice(-6);
  const dniPaciente = '71' + uniq;
  const emailPaciente = `paciente${uniq}@test.com`;
  r = await fetchJson(`${GW}/api/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dni: dniPaciente, email: emailPaciente, password: PACIENTE_PASSWORD, nombre: 'Paciente', apellido: 'Test' }),
  });
  log('3. Register paciente', r.status, r.body.success, r.body.error?.mensaje || '');

  // 4. Login paciente
  r = await fetchJson(`${GW}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dni: dniPaciente, email: emailPaciente, password: PACIENTE_PASSWORD }),
  });
  log('4. Login paciente', r.status, r.body.success);
  const patientToken = r.body.data?.token;
  if (!patientToken) { console.log('Abort: no patient token'); return; }

  // 5. Disponibilidad médico-fecha (lunes)
  r = await fetchJson(`${GW}/api/appointments/availability?medicoId=${existingDoctorId}&fecha=${fechaStr}T00:00:00.000Z`, {
    headers: { Authorization: `Bearer ${patientToken}` },
  });
  log('5. Disp médico lunes', r.status, r.body.success, `slots=${r.body.data?.length ?? 0}`);
  const slots = r.body.data || [];
  const slot = slots.find(s => s.disponible);
  if (!slot) console.log('   ⚠️ No hay slots libres en lunes para este médico');

  // 6. Reserva manual
  let citaId;
  if (slot) {
    const fechaHora = `${fechaStr}T${slot.horaInicio}:00Z`;
    r = await fetchJson(`${GW}/api/appointments/book/manual`, {
      method: 'POST', headers: { Authorization: `Bearer ${patientToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ medicoId: existingDoctorId, fechaHora, motivo: 'Consulta general' }),
    });
    log('6. Reserva manual', r.status, r.body.success, r.body.data?.appointment?.id ? `id=${r.body.data.appointment.id}` : r.body.error?.mensaje);
    citaId = r.body.data?.appointment?.id;
  }

  // 7. Listar citas paciente
  r = await fetchJson(`${GW}/api/appointments/patient/me`, { headers: { Authorization: `Bearer ${patientToken}` } });
  log('7. Listar paciente', r.status, r.body.success, `citas=${r.body.data?.length ?? 0}`);

  // 8. Cancelar cita
  if (citaId) {
    r = await fetchJson(`${GW}/api/appointments/patient/${citaId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${patientToken}` } });
    log('8. Cancelar cita', r.status, r.body.success);
  }

  // 9. Reserva automática
  r = await fetchJson(`${GW}/api/appointments/book/automatic`, {
    method: 'POST', headers: { Authorization: `Bearer ${patientToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ especialidadId: specialtyId }),
  });
  log('9. Reserva automática', r.status, r.body.success, r.body.data?.appointment?.id ? `id=${r.body.data.appointment.id}` : r.body.error?.mensaje);
  const citaAuto = r.body.data?.appointment;

  // 10. Crear médico de prueba con password conocida
  const dniMedico = '72' + uniq;
  const emailMedico = `medico${uniq}@test.com`;
  const usernameMedico = `medicoprueba${uniq}`;
  r = await fetchJson(`${GW}/api/admin/doctors`, {
    method: 'POST', headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: 'Medico', apellido: 'Prueba', dni: dniMedico, email: emailMedico,
      telefono: '999888777', username: usernameMedico, specialtyId, shift: 'MANANA',
      password: MEDICO_PASSWORD, schedules: [{ diaSemana: 1, horaInicio: '09:00', horaFin: '13:00' }],
    }),
  });
  log('10. Crear médico prueba', r.status, r.body.success, r.body.error?.mensaje || '');

  // 11. Login médico
  r = await fetchJson(`${GW}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dni: dniMedico, email: emailMedico, password: MEDICO_PASSWORD }),
  });
  log('11. Login médico', r.status, r.body.success);
  const doctorToken = r.body.data?.token;

  // 12. Calendario médico
  if (doctorToken) {
    r = await fetchJson(`${GW}/api/appointments/doctor/calendar`, { headers: { Authorization: `Bearer ${doctorToken}` } });
    log('12. Calendario médico', r.status, r.body.success, `citas=${r.body.data?.length ?? 0}`);
  }

  // 13. Cambiar estado cita automática
  if (doctorToken && citaAuto) {
    r = await fetchJson(`${GW}/api/appointments/doctor/${citaAuto.id}/status`, {
      method: 'PATCH', headers: { Authorization: `Bearer ${doctorToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'EN_ATENCION' }),
    });
    log('13. Cambiar estado', r.status, r.body.success, r.body.data?.estado || '');
  }

  // 14. Reprogramar la cita automática (paciente)
  if (citaAuto && patientToken && slot) {
    const nuevaFechaHora = `${fechaStr}T${slots.find(s => s.disponible && s.horaInicio !== slot.horaInicio)?.horaInicio || slot.horaInicio}:00`;
    r = await fetchJson(`${GW}/api/appointments/patient/${citaAuto.id}`, {
      method: 'PUT', headers: { Authorization: `Bearer ${patientToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fechaHora: nuevaFechaHora }),
    });
    log('14. Reprogramar cita', r.status, r.body.success, r.body.error?.mensaje || '');
  }

  console.log('\n=== PRUEBAS COMPLETADAS ===');
}

main().catch(console.error);
