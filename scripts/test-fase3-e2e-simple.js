/**
 * Script E2E rápido para Fase 3 — asume servicios corriendo en localhost
 */

const GW = 'http://localhost:8080';

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

  // 1. Login admin
  let r = await fetchJson(`${GW}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dni: '00000000', email: 'admin@clinicax.com', password: 'Admin123!' }),
  });
  log('1. Login admin', r.status, r.body.success);
  const adminToken = r.body.data?.token;

  // 2. Obtener médicos existentes
  r = await fetchJson(`${GW}/api/admin/doctors`, { headers: { Authorization: `Bearer ${adminToken}` } });
  log('2. Listar médicos', r.status, r.body.success, `(${r.body.data?.doctors?.length ?? 0} docs)`);
  const docs = r.body.data?.doctors || [];
  if (docs.length === 0) { console.log('No hay médicos, abortando.'); return; }
  const testDoc = docs[0];
  const doctorId = testDoc.id;
  const specialtyId = testDoc.specialtyId;

  // Generar valores únicos
  const uniq = Date.now().toString().slice(-6);
  const dniPaciente = '71' + uniq;
  const emailPaciente = `paciente${uniq}@test.com`;

  // 3. Registrar paciente
  r = await fetchJson(`${GW}/api/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dni: dniPaciente, email: emailPaciente, password: 'Paciente123!', nombre: 'Paciente', apellido: 'Test' }),
  });
  log('3. Register paciente', r.status, r.body.success, r.body.error?.mensaje || '');

  // 4. Login paciente
  r = await fetchJson(`${GW}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dni: dniPaciente, email: emailPaciente, password: 'Paciente123!' }),
  });
  log('4. Login paciente', r.status, r.body.success);
  const patientToken = r.body.data?.token;
  if (!patientToken) { console.log('No patient token'); return; }

  // 5. Disponibilidad por especialidad
  r = await fetchJson(`${GW}/api/appointments/availability/specialty/${specialtyId}`, {
    headers: { Authorization: `Bearer ${patientToken}` },
  });
  log('5. Disp especialidad', r.status, r.body.success, `(${r.body.data?.length ?? 0} doctores)`);

  // 6. Disponibilidad médico fecha
  const manana = new Date(); manana.setDate(manana.getDate() + 1);
  const fechaStr = manana.toISOString().split('T')[0];
  r = await fetchJson(`${GW}/api/appointments/availability?medicoId=${doctorId}&fecha=${fechaStr}T00:00:00.000Z`, {
    headers: { Authorization: `Bearer ${patientToken}` },
  });
  log('6. Disp médico', r.status, r.body.success, `(${r.body.data?.length ?? 0} slots)`);
  const slots = r.body.data || [];
  const slot = slots.find(s => s.disponible);

  // 7. Reserva manual
  let citaId;
  if (slot) {
    const fechaHora = `${fechaStr}T${slot.horaInicio}:00`;
    r = await fetchJson(`${GW}/api/appointments/book/manual`, {
      method: 'POST', headers: { Authorization: `Bearer ${patientToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ medicoId: doctorId, fechaHora, motivo: 'Consulta general' }),
    });
    log('7. Reserva manual', r.status, r.body.success, r.body.data?.appointment?.id ? `id=${r.body.data.appointment.id}` : r.body.error?.mensaje);
    citaId = r.body.data?.appointment?.id;
  } else {
    console.log('7. Reserva manual: ⚠️ No hay slots disponibles');
  }

  // 8. Listar citas paciente
  r = await fetchJson(`${GW}/api/appointments/patient/me`, { headers: { Authorization: `Bearer ${patientToken}` } });
  log('8. Listar paciente', r.status, r.body.success, `(${r.body.data?.length ?? 0} citas)`);

  // 9. Cancelar cita
  if (citaId) {
    r = await fetchJson(`${GW}/api/appointments/patient/${citaId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${patientToken}` } });
    log('9. Cancelar cita', r.status, r.body.success);
  }

  // 10. Reserva automática
  r = await fetchJson(`${GW}/api/appointments/book/automatic`, {
    method: 'POST', headers: { Authorization: `Bearer ${patientToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ especialidadId: specialtyId }),
  });
  log('10. Reserva automática', r.status, r.body.success, r.body.data?.appointment?.id ? `id=${r.body.data.appointment.id}` : r.body.error?.mensaje);
  const citaAuto = r.body.data?.appointment;

  // 11. Crear médico de prueba con password conocida para login médico
  const dniMedico = '72' + uniq;
  const emailMedico = `medico${uniq}@test.com`;
  const usernameMedico = `medicoprueba${uniq}`;
  r = await fetchJson(`${GW}/api/admin/doctors`, {
    method: 'POST', headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: 'Medico', apellido: 'Prueba', dni: dniMedico, email: emailMedico,
      telefono: '999888777', username: usernameMedico, specialtyId, shift: 'MANANA',
      password: 'Medico123!', schedules: [{ diaSemana: 1, horaInicio: '09:00', horaFin: '13:00' }],
    }),
  });
  log('11. Crear médico prueba', r.status, r.body.success, r.body.error?.mensaje || '');

  // 12. Login médico
  r = await fetchJson(`${GW}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dni: dniMedico, email: emailMedico, password: 'Medico123!' }),
  });
  log('12. Login médico', r.status, r.body.success);
  const doctorToken = r.body.data?.token;

  // 13. Calendario médico
  if (doctorToken) {
    r = await fetchJson(`${GW}/api/appointments/doctor/calendar`, { headers: { Authorization: `Bearer ${doctorToken}` } });
    log('13. Calendario médico', r.status, r.body.success, `(${r.body.data?.length ?? 0} citas)`);
  }

  // 14. Cambiar estado cita (si hay cita automática)
  if (doctorToken && citaAuto) {
    r = await fetchJson(`${GW}/api/appointments/doctor/${citaAuto.id}/status`, {
      method: 'PATCH', headers: { Authorization: `Bearer ${doctorToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'EN_ATENCION' }),
    });
    log('14. Cambiar estado', r.status, r.body.success, r.body.data?.estado || '');
  }

  console.log('\n=== PRUEBAS COMPLETADAS ===');
}

main().catch(console.error);
