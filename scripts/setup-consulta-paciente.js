/**
 * ============================================================================
 * Script: setup-consulta-paciente.js
 * ============================================================================
 * Orquesta la creación de:
 *   1. Usuario médico (con rol MEDICO)
 *   2. Usuario paciente DNI 71132903
 *   3. Consulta ACTIVA iniciada por el médico para el paciente
 *   4. Finalización de la consulta con diagnóstico, análisis y medicamentos
 *
 * Uso:
 *   node scripts/setup-consulta-paciente.js
 *   o
 *   npx tsx scripts/setup-consulta-paciente.ts
 * ============================================================================
 */

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

// ─── Credenciales ───────────────────────────────────────────────────────────
const ADMIN_CREDENTIALS = {
  email: 'admin@clinicax.com',
  password: process.env['ADMIN_PASSWORD'] ?? '',
};

const DOCTOR_PASSWORD = process.env['DOCTOR_PASSWORD'] ?? '';

const DOCTOR_DATA = {
  nombre: 'Dr. Test',
  apellido: 'Automático',
  dni: '88888888',
  email: 'test.doctor@clinicax.com',
  telefono: '999999999',
  username: 'dr.test.auto',
  specialtyId: '', // se llena dinámicamente
  shift: 'MANANA',
  password: DOCTOR_PASSWORD,
  schedules: [
    { diaSemana: 1, horaInicio: '08:00', horaFin: '12:00' },
    { diaSemana: 2, horaInicio: '08:00', horaFin: '12:00' },
    { diaSemana: 3, horaInicio: '08:00', horaFin: '12:00' },
    { diaSemana: 4, horaInicio: '08:00', horaFin: '12:00' },
    { diaSemana: 5, horaInicio: '08:00', horaFin: '12:00' },
  ],
};

const PATIENT_DATA = {
  dni: '71132903',
  email: 'anrrous.work@gmail.com',
  password: process.env['PATIENT_PASSWORD'] ?? '',
  nombre: 'Andrés',
  apellido: 'Pineda',
  telefono: '987654321',
};

const CONSULTATION_PAYLOAD = {
  motivoConsulta: 'Dolor abdominal leve',
};

const FINALIZE_PAYLOAD = {
  diagnostico: 'Gastroenteritis aguda — prueba de integración',
  notas: 'Reposo e hidratación. Control en 7 días.',
  analysisOrders: [
    { examName: 'Sangre', specialty: 'HEMATOLOGIA' },
    { examName: 'Orina', specialty: 'UROLOGIA' },
  ],
  medications: [
    { name: 'Paracetamol 500mg', days: 365, frequency: 'Cada 8 horas' },
    { name: 'Ibuprofeno 400mg', days: 365, frequency: 'Cada 12 horas' },
    { name: 'Omeprazol 20mg', days: 365, frequency: 'Cada 24 horas' },
  ],
};

// ─── Helpers ────────────────────────────────────────────────────────────────

async function apiCall(method, path, body = null, token = null) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = {
    method,
    headers,
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(url, options);
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const err = new Error(
      `HTTP ${res.status} en ${path}: ${data?.error?.mensaje || data?.message || res.statusText}`
    );
    err.status = res.status;
    err.response = data;
    throw err;
  }
  return data;
}

async function login(credentials) {
  return apiCall('POST', '/api/auth/login', credentials);
}

async function getAdminSpecialties(token) {
  return apiCall('GET', '/api/admin/specialties', null, token);
}

async function createDoctor(data, token) {
  return apiCall('POST', '/api/admin/doctors', data, token);
}

async function registerPatient(data) {
  return apiCall('POST', '/api/auth/register', data);
}

async function startConsultation(data, token) {
  return apiCall('POST', '/api/medical/doctor/consultation/start', data, token);
}

async function finalizeConsultation(consultationId, data, token) {
  return apiCall('POST', `/api/medical/doctor/consultation/${consultationId}/finalize`, data, token);
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Iniciando setup de consulta de prueba...\n');

  try {
    // ── 1. Login Admin ──────────────────────────────────────────────────────
    console.log('🔐 1. Login como Admin...');
    const adminLogin = await login(ADMIN_CREDENTIALS);
    const adminToken = adminLogin.data.token;
    console.log('   ✅ Admin autenticado.\n');

    // ── 2. Obtener especialidades ───────────────────────────────────────────
    console.log('📋 2. Obteniendo especialidades...');
    const specialtiesRes = await getAdminSpecialties(adminToken);
    const specialties = specialtiesRes.data || [];
    const medicinaGeneral = specialties.find((s) =>
      s.nombre.toLowerCase().includes('medicina general')
    );
    if (!medicinaGeneral) {
      console.error('   ❌ No se encontró especialidad "Medicina General".');
      console.error('   Especialidades disponibles:', specialties.map((s) => s.nombre).join(', '));
      process.exit(1);
    }
    DOCTOR_DATA.specialtyId = medicinaGeneral.id;
    console.log(`   ✅ Especialidad "Medicina General" ID: ${medicinaGeneral.id}\n`);

    // ── 3. Crear médico ─────────────────────────────────────────────────────
    console.log('👨‍⚕️ 3. Creando médico de prueba...');
    let doctorRes;
    try {
      doctorRes = await createDoctor(DOCTOR_DATA, adminToken);
    } catch (err) {
      if (err.status === 409) {
        console.log('   ⚠️ El médico ya existe. Intentando login como médico...');
      } else {
        throw err;
      }
    }
    console.log('   ✅ Médico listo.\n');

    // ── 4. Login como médico ──────────────────────────────────────────────
    console.log('🔐 4. Login como médico...');
    const doctorLogin = await login({
      email: DOCTOR_DATA.email,
      password: DOCTOR_DATA.password,
    });
    const doctorToken = doctorLogin.data.token;
    const doctorUser = doctorLogin.data.usuario;
    console.log(`   ✅ Médico autenticado: ${doctorUser.nombre} ${doctorUser.apellido} (ID: ${doctorUser.id})\n`);

    // ── 5. Registrar paciente ───────────────────────────────────────────────
    console.log('🙋 5. Registrando paciente...');
    let patientRes;
    try {
      patientRes = await registerPatient(PATIENT_DATA);
    } catch (err) {
      if (err.status === 409) {
        console.log('   ⚠️ El paciente ya existe. Intentando login para obtener datos...');
        const patientLogin = await login({
          email: PATIENT_DATA.email,
          password: PATIENT_DATA.password,
        });
        patientRes = patientLogin;
      } else {
        throw err;
      }
    }
    const patientUser = patientRes.data.usuario;
    const patientToken = patientRes.data.token;
    console.log(
      `   ✅ Paciente listo: ${patientUser.nombre} ${patientUser.apellido} (ID: ${patientUser.id}, DNI: ${patientUser.dni})\n`
    );

    // ── 6. Iniciar consulta ─────────────────────────────────────────────────
    console.log('🩺 6. Iniciando consulta...');
    const consultationRes = await startConsultation(
      {
        pacienteId: patientUser.id,
        ...CONSULTATION_PAYLOAD,
      },
      doctorToken
    );
    const consultation = consultationRes.data;
    console.log(`   ✅ Consulta activa creada (ID: ${consultation.id})\n`);

    // ── 7. Finalizar consulta ───────────────────────────────────────────────
    console.log('💊 7. Finalizando consulta con diagnóstico, análisis y medicamentos...');
    const finalizeRes = await finalizeConsultation(consultation.id, FINALIZE_PAYLOAD, doctorToken);
    const finalized = finalizeRes.data;
    console.log(`   ✅ Consulta finalizada (ID: ${finalized.id})`);
    console.log(`   📋 Diagnóstico: ${finalized.diagnostico || FINALIZE_PAYLOAD.diagnostico}`);
    console.log(`   🔬 Análisis asignados: ${FINALIZE_PAYLOAD.analysisOrders.length}`);
    console.log(`   💊 Medicamentos: ${FINALIZE_PAYLOAD.medications.length} (365 días cada uno)`);
    console.log('');

    // ── Resumen ─────────────────────────────────────────────────────────────
    console.log('══════════════════════════════════════════════════════════');
    console.log('   🎉 SETUP COMPLETADO CON ÉXITO');
    console.log('══════════════════════════════════════════════════════════');
    console.log('');
    console.log('   👤 Paciente:');
    console.log(`      DNI:    ${PATIENT_DATA.dni}`);
    console.log(`      Email:  ${PATIENT_DATA.email}`);
    console.log('');
    console.log('   👨‍⚕️ Médico:');
    console.log(`      Email:  ${DOCTOR_DATA.email}`);
    console.log('');
    console.log('   📋 Consulta:');
    console.log(`      ID:     ${finalized.id}`);
    console.log(`      Estado: ${finalized.estado}`);
    console.log('');
    console.log('══════════════════════════════════════════════════════════');
    console.log('');
    console.log('👉 Ahora puedes iniciar sesión como paciente y verificar');
    console.log('   en /perfil → Tratamiento que aparecen los análisis y');
    console.log('   medicamentos.');
    console.log('');
  } catch (error) {
    console.error('\n❌ ERROR en el setup:\n', error.message || error);
    if (error.response) {
      console.error('   Detalle:', JSON.stringify(error.response, null, 2));
    }
    process.exit(1);
  }
}

main();
