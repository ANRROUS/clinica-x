/**
 * Test E2E completo de Fase 4: clinical-service + file-service
 */

const GATEWAY = 'http://localhost:8080';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';
const PACIENTE_PASSWORD = process.env.PACIENTE_PASSWORD || 'Paciente123!';
const TEMPORAL_PASSWORD = process.env.TEMPORAL_PASSWORD || 'Temporal123!';

async function request(method, path, body, token) {
  const url = `${GATEWAY}${path}`;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function login(dni, email, password) {
  const res = await request('POST', '/api/auth/login', { dni, email, password });
  return res.data.success ? res.data.data.token : null;
}

async function main() {
  console.log('=== FASE 4 E2E TESTS ===\n');

  // 1. Login admin
  console.log('1. Login admin...');
  const adminToken = await login('00000000', 'admin@clinicax.com', ADMIN_PASSWORD);
  if (!adminToken) { console.error('   ❌ Falló login admin'); process.exit(1); }
  console.log('   ✅ Login admin OK');

  // 2. Especialidad real
  const especialidadId = '4c2dceed-452d-41e0-933b-a55c6cc70c8c';
  console.log('2. Especialidad OK (Medicina General)');

  // 3. Registrar paciente
  console.log('3. Registrar paciente...');
  const pacienteDni = '87654321';
  const pacienteEmail = 'paciente_test@clinicax.com';
  await request('POST', '/api/auth/register', {
    dni: pacienteDni, nombre: 'Test', apellido: 'Paciente', email: pacienteEmail,
    password: PACIENTE_PASSWORD, telefono: '999999999',
  });
  const pacienteToken = await login(pacienteDni, pacienteEmail, PACIENTE_PASSWORD);
  if (!pacienteToken) { console.error('   ❌ Falló login paciente'); process.exit(1); }
  console.log('   ✅ Paciente OK');

  // 4. Crear médico vía admin (FORMATO CORRECTO en inglés)
  console.log('4. Crear médico...');
  const medicoDni = '11223344';
  const medicoEmail = 'medico_test@clinicax.com';
  const medicoRes = await request('POST', '/api/admin/doctors', {
    dni: medicoDni, nombre: 'Test', apellido: 'Médico', email: medicoEmail,
    telefono: '888888888', username: 'medico_test', specialtyId: especialidadId,
    shift: 'MANANA', password: TEMPORAL_PASSWORD,
    schedules: [{ diaSemana: 1, horaInicio: '08:00', horaFin: '12:00' }],
  }, adminToken);
  console.log(`   ${medicoRes.data.success ? '✅' : '❌'} Crear médico: ${medicoRes.data.success ? 'OK' : medicoRes.data.error?.mensaje || 'Error'}`);
  if (!medicoRes.data.success) { console.log('   Abortando tests de médico...'); }

  // 5. Login médico
  let medicoToken = null;
  if (medicoRes.data.success) {
    console.log('5. Login médico...');
    medicoToken = await login(medicoDni, medicoEmail, TEMPORAL_PASSWORD);
    console.log(`   ${medicoToken ? '✅' : '❌'} Login médico`);
  }

  // --- CLINICAL-SERVICE TESTS ---
  console.log('\n--- CLINICAL-SERVICE ---');

  let consultaId = null;
  let pacienteId = null;

  if (pacienteToken) {
    const meRes = await request('GET', '/api/auth/me', null, pacienteToken);
    pacienteId = meRes.data.data?.id;
  }

  // 6. Iniciar consulta
  if (medicoToken && pacienteId) {
    console.log('6. Iniciar consulta (médico)...');
    const startRes = await request('POST', '/api/medical/doctor/consultation/start', {
      pacienteId, motivoConsulta: 'Dolor de cabeza',
    }, medicoToken);
    console.log(`   ${startRes.data.success ? '✅' : '❌'} Iniciar: ${startRes.data.success ? 'OK' : startRes.data.error?.mensaje} (status ${startRes.status})`);
    if (startRes.data.success) { consultaId = startRes.data.data.id; console.log(`   ID: ${consultaId}`); }
  } else { console.log('6. ⚠️ Saltando (sin médico)'); }

  // 7. Finalizar consulta
  if (consultaId && medicoToken) {
    console.log('7. Finalizar consulta (médico)...');
    const finRes = await request('POST', `/api/medical/doctor/consultation/${consultaId}/finalize`, {
      diagnostico: 'Migraña tensional', notas: 'Reposo',
    }, medicoToken);
    console.log(`   ${finRes.data.success ? '✅' : '❌'} Finalizar: ${finRes.data.success ? 'OK' : finRes.data.error?.mensaje} (status ${finRes.status})`);
  } else { console.log('7. ⚠️ Saltando (sin consulta)'); }

  // 8. Intentar iniciar consulta duplicada (debe fallar)
  if (medicoToken && pacienteId && consultaId) {
    console.log('8. Iniciar consulta duplicada (esperado: error)...');
    const dupRes = await request('POST', '/api/medical/doctor/consultation/start', {
      pacienteId, motivoConsulta: 'Otra vez',
    }, medicoToken);
    console.log(`   ${!dupRes.data.success ? '✅' : '❌'} Duplicada: ${dupRes.data.error?.mensaje || 'Error'} (status ${dupRes.status})`);
  } else { console.log('8. ⚠️ Saltando'); }

  // 9. Historial paciente
  if (pacienteToken) {
    console.log('9. Historial paciente...');
    const histRes = await request('GET', '/api/medical/patient/history', null, pacienteToken);
    console.log(`   ${histRes.data.success ? '✅' : '❌'} Historial: ${histRes.data.success ? `${histRes.data.data?.length || 0} consultas` : histRes.data.error?.mensaje} (status ${histRes.status})`);
  }

  // 10. Obtener consulta por ID
  if (consultaId && pacienteToken) {
    console.log('10. Obtener consulta por ID...');
    const getRes = await request('GET', `/api/medical/patient/consultation/${consultaId}`, null, pacienteToken);
    console.log(`   ${getRes.data.success ? '✅' : '❌'} Obtener: ${getRes.data.success ? `estado=${getRes.data.data?.estado}` : getRes.data.error?.mensaje} (status ${getRes.status})`);
  } else { console.log('10. ⚠️ Saltando'); }

  // --- FILE-SERVICE TESTS ---
  console.log('\n--- FILE-SERVICE ---');

  // 11. Upload sin archivo
  if (pacienteToken) {
    console.log('11. Upload sin archivo...');
    const upRes = await request('POST', '/api/files/upload', {}, pacienteToken);
    console.log(`   ${!upRes.data.success ? '✅' : '❌'} Sin archivo: ${upRes.data.error?.mensaje} (status ${upRes.status})`);
  }

  // 12. Signed URL inexistente
  if (pacienteToken) {
    console.log('12. Signed URL inexistente...');
    const urlRes = await request('GET', '/api/files/00000000-0000-0000-0000-000000000000/signed-url', null, pacienteToken);
    console.log(`   ${!urlRes.data.success ? '✅' : '❌'} No encontrado: ${urlRes.data.error?.mensaje} (status ${urlRes.status})`);
  }

  console.log('\n=== FIN DE TESTS ===');
}

main().catch(console.error);
