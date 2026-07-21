/**
 * ============================================================================
 * Script E2E de prueba para Fase 3 — Booking
 * ============================================================================
 * Lanza auth-service, appointment-service y api-gateway, espera a que
 * arranquen, ejecuta flujo completo de pruebas y luego los mata.
 * ============================================================================
 */

const ADMIN_PASSWORD = process.env['ADMIN_PASSWORD'] ?? '';
const DOCTOR_PASSWORD = process.env['DOCTOR_PASSWORD'] ?? '';
const MEDICO_PASSWORD = process.env['MEDICO_PASSWORD'] ?? '';
const PACIENTE_PASSWORD = process.env['PACIENTE_PASSWORD'] ?? '';
const path = require('path');

const root = __dirname;

function startService(name, cwd) {
  const proc = spawn(process.execPath, ['dist/server.js'], {
    cwd,
    env: process.env,
    stdio: 'pipe',
  });
  proc.stdout.on('data', (d) => console.log(`[${name}] ${d.toString().trim()}`));
  proc.stderr.on('data', (d) => console.error(`[${name}] ${d.toString().trim()}`));
  return proc;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJson(url, opts = {}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  try {
    return { status: res.status, body: JSON.parse(text) };
  } catch {
    return { status: res.status, body: text };
  }
}

async function main() {
  console.log('=== Iniciando servicios ===');
  const auth = startService('auth', path.join(root, 'services/auth-service'));
  const appointment = startService('appointment', path.join(root, 'services/appointment-service'));
  const gateway = startService('gateway', path.join(root, 'services/api-gateway'));

  await sleep(8000);

  try {
    console.log('\n=== 1. Health checks ===');
    let r = await fetchJson('http://localhost:3000/health');
    console.log('auth health:', r.status, r.body.success);
    r = await fetchJson('http://localhost:3001/health');
    console.log('appointment health:', r.status, r.body.success);
    r = await fetchJson('http://localhost:8080/health');
    console.log('gateway health:', r.status, r.body.success);

    console.log('\n=== 2. Login Admin ===');
    r = await fetchJson('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dni: '00000000', email: 'admin@clinicax.com', password: ADMIN_PASSWORD }),
    });
    console.log('login admin:', r.status, r.body.success ? 'OK' : 'FAIL');
    const adminToken = r.body.data?.token;
    if (!adminToken) throw new Error('No se pudo obtener token de admin');

    console.log('\n=== 3. Crear médico de prueba ===');
    // Obtener especialidades
    r = await fetchJson('http://localhost:8080/api/admin/doctors', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    // No importa si falla, vamos a crear un médico con specialtyId existente
    // Consultamos especialidades directamente por prisma? No, vamos a usar el endpoint de listar médicos para obtener las especialidades que ya existen
    // En realidad, vamos a crear un médico con un specialtyId cualquiera si no existe
    // Mejor: listar especialidades
    // No hay endpoint público de especialidades. Vamos a crear médico con UUID dummy y ver si existe especialidad
    // Alternativa: usar la BD directamente
    // Vamos a simplemente usar el médico existente si es posible
    // Primero obtengamos el médico existente
    r = await fetchJson('http://localhost:8080/api/admin/doctors', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log('listar medicos:', r.status, r.body.success ? 'OK' : 'FAIL');
    const doctors = r.body.data?.doctors || [];
    const existingDoctor = doctors[0];
    let doctorId, specialtyId, doctorUserId;
    if (existingDoctor) {
      doctorId = existingDoctor.id;
      specialtyId = existingDoctor.specialtyId;
      doctorUserId = existingDoctor.usuarioId;
      console.log('Usando médico existente:', doctorId, existingDoctor.username);
    } else {
      // Crear médico nuevo
      specialtyId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'; // dummy
      r = await fetchJson('http://localhost:8080/api/admin/doctors', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: 'Test', apellido: 'Doctor', dni: '99999999', email: 'testdoc@x.com',
          telefono: '999999999', username: 'testdoctor', specialtyId, shift: 'MANANA',
          password: DOCTOR_PASSWORD, schedules: [{ diaSemana: 1, horaInicio: '08:00', horaFin: '12:00' }],
        }),
      });
      console.log('crear médico:', r.status, JSON.stringify(r.body));
      doctorId = r.body.data?.doctor?.id;
      doctorUserId = r.body.data?.doctor?.usuarioId;
    }

    console.log('\n=== 4. Login como médico ===');
    // Si usamos médico existente, no sabemos su password. Si creamos nuevo, sabemos la password.
    // Vamos a asumir que siempre creamos uno nuevo para simplificar.
    if (!doctorId) {
      console.log('Creando médico de prueba...');
      r = await fetchJson('http://localhost:8080/api/admin/doctors', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: 'Test', apellido: 'Doctor', dni: '99999998', email: 'testdoc2@x.com',
          telefono: '999999999', username: 'testdoctor2', specialtyId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', shift: 'MANANA',
          password: DOCTOR_PASSWORD, schedules: [{ diaSemana: 1, horaInicio: '08:00', horaFin: '12:00' }],
        }),
      });
      console.log('crear médico2:', r.status, JSON.stringify(r.body));
      doctorId = r.body.data?.doctor?.id;
      doctorUserId = r.body.data?.doctor?.usuarioId;
    }

    // Obtener lista de especialidades para usar una real
    // Consultamos directamente a la BD del appointment-service por HTTP? No hay endpoint.
    // Vamos a crear un médico con un specialtyId random; si falla por especialidad no existe, necesitamos seedear
    // En su lugar, vamos a consultar los doctores existentes y usar su specialtyId
    r = await fetchJson('http://localhost:8080/api/admin/doctors', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const docs = r.body.data?.doctors || [];
    if (docs.length === 0) {
      console.log('No hay médicos ni especialidades. Abortando prueba.');
      return;
    }
    const testDoc = docs[0];
    doctorId = testDoc.id;
    specialtyId = testDoc.specialtyId;
    doctorUserId = testDoc.usuarioId;
    console.log('Médico para pruebas:', testDoc.username, 'specialty:', specialtyId);

    console.log('\n=== 5. Registrar paciente ===');
    const dniPaciente = '71234567';
    const emailPaciente = 'paciente@test.com';
    r = await fetchJson('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dni: dniPaciente, email: emailPaciente, password: PACIENTE_PASSWORD }),
    });
    console.log('register paciente:', r.status, r.body.success ? 'OK' : 'FAIL', r.body.error?.mensaje || '');

    console.log('\n=== 6. Login paciente ===');
    r = await fetchJson('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dni: dniPaciente, email: emailPaciente, password: PACIENTE_PASSWORD }),
    });
    console.log('login paciente:', r.status, r.body.success ? 'OK' : 'FAIL');
    const patientToken = r.body.data?.token;
    if (!patientToken) throw new Error('No se pudo obtener token de paciente');

    console.log('\n=== 7. Disponibilidad por especialidad ===');
    r = await fetchJson(`http://localhost:8080/api/appointments/availability/specialty/${specialtyId}`, {
      headers: { Authorization: `Bearer ${patientToken}` },
    });
    console.log('disp especialidad:', r.status, r.body.success ? 'OK' : 'FAIL', 'doctores:', r.body.data?.length ?? 0);

    console.log('\n=== 8. Disponibilidad por médico y fecha ===');
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    manana.setHours(0, 0, 0, 0);
    const fechaStr = manana.toISOString().split('T')[0];
    r = await fetchJson(`http://localhost:8080/api/appointments/availability?medicoId=${doctorId}&fecha=${fechaStr}T00:00:00.000Z`, {
      headers: { Authorization: `Bearer ${patientToken}` },
    });
    console.log('disp médico:', r.status, r.body.success ? 'OK' : 'FAIL', 'slots:', r.body.data?.length ?? 0);

    // Buscar primer slot disponible
    const slots = r.body.data || [];
    const slotDisponible = slots.find((s) => s.disponible);

    console.log('\n=== 9. Reserva manual ===');
    if (slotDisponible) {
      const fechaHoraStr = `${fechaStr}T${slotDisponible.horaInicio}:00`;
      r = await fetchJson('http://localhost:8080/api/appointments/book/manual', {
        method: 'POST',
        headers: { Authorization: `Bearer ${patientToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicoId: doctorId, fechaHora: fechaHoraStr, motivo: 'Consulta general' }),
      });
      console.log('reserva manual:', r.status, r.body.success ? 'OK' : 'FAIL', r.body.data?.appointment?.id ? 'id:' + r.body.data.appointment.id : r.body.error?.mensaje);
    } else {
      console.log('No hay slots disponibles para reserva manual');
    }

    console.log('\n=== 10. Listar citas paciente ===');
    r = await fetchJson('http://localhost:8080/api/appointments/patient/me', {
      headers: { Authorization: `Bearer ${patientToken}` },
    });
    console.log('listar paciente:', r.status, r.body.success ? 'OK' : 'FAIL', 'citas:', r.body.data?.length ?? 0);
    const citaPaciente = (r.body.data || [])[0];

    console.log('\n=== 11. Cancelar cita ===');
    if (citaPaciente) {
      r = await fetchJson(`http://localhost:8080/api/appointments/patient/${citaPaciente.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${patientToken}` },
      });
      console.log('cancelar cita:', r.status, r.body.success ? 'OK' : 'FAIL');
    }

    console.log('\n=== 12. Reserva automática ===');
    r = await fetchJson('http://localhost:8080/api/appointments/book/automatic', {
      method: 'POST',
      headers: { Authorization: `Bearer ${patientToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ especialidadId: specialtyId, motivo: 'Urgencia leve' }),
    });
    console.log('reserva automática:', r.status, r.body.success ? 'OK' : 'FAIL', r.body.data?.appointment?.id ? 'id:' + r.body.data.appointment.id : r.body.error?.mensaje);

    console.log('\n=== 13. Login médico ===');
    // Necesitamos credenciales del médico. Si es el existente, no sabemos password.
    // Creamos un nuevo médico con credenciales conocidas para probar calendario médico
    console.log('Creando médico de prueba para login...');
    const dniMedico = '71234568';
    const emailMedico = 'medico@test.com';
    r = await fetchJson('http://localhost:8080/api/admin/doctors', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Medico', apellido: 'Prueba', dni: dniMedico, email: emailMedico,
        telefono: '999888777', username: 'medicoprueba', specialtyId, shift: 'MANANA',
        password: MEDICO_PASSWORD, schedules: [
          { diaSemana: 1, horaInicio: '09:00', horaFin: '13:00' },
          { diaSemana: 2, horaInicio: '09:00', horaFin: '13:00' },
        ],
      }),
    });
    console.log('crear médico prueba:', r.status, r.body.success ? 'OK' : 'FAIL', r.body.error?.mensaje || '');

    r = await fetchJson('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dni: dniMedico, email: emailMedico, password: MEDICO_PASSWORD }),
    });
    console.log('login médico:', r.status, r.body.success ? 'OK' : 'FAIL');
    const doctorToken = r.body.data?.token;

    console.log('\n=== 14. Calendario médico ===');
    if (doctorToken) {
      r = await fetchJson('http://localhost:8080/api/appointments/doctor/calendar', {
        headers: { Authorization: `Bearer ${doctorToken}` },
      });
      console.log('calendario médico:', r.status, r.body.success ? 'OK' : 'FAIL', 'citas:', r.body.data?.length ?? 0);
    }

    console.log('\n=== 15. Cambiar estado cita (médico) ===');
    if (doctorToken && citaPaciente) {
      // La cita fue cancelada, creamos otra para cambiar estado
      r = await fetchJson('http://localhost:8080/api/appointments/book/automatic', {
        method: 'POST',
        headers: { Authorization: `Bearer ${patientToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ especialidadId: specialtyId }),
      });
      const citaNueva = r.body.data?.appointment;
      if (citaNueva) {
        r = await fetchJson(`http://localhost:8080/api/appointments/doctor/${citaNueva.id}/status`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${doctorToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: 'EN_ATENCION' }),
        });
        console.log('cambiar estado:', r.status, r.body.success ? 'OK' : 'FAIL', r.body.data?.estado);
      }
    }

    console.log('\n=== PRUEBAS COMPLETADAS ===');
  } catch (err) {
    console.error('ERROR E2E:', err);
  } finally {
    console.log('\n=== Deteniendo servicios ===');
    auth.kill();
    appointment.kill();
    gateway.kill();
    await sleep(1000);
    console.log('Servicios detenidos');
  }
}

main();
