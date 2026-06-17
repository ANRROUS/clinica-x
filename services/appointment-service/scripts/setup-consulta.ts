/**
 * ============================================================================
 * Script: setup-consulta.ts
 * ============================================================================
 * Ejecutar desde el directorio del appointment-service:
 *   npx tsx scripts/setup-consulta.ts
 * ============================================================================
 * Orquesta:
 *   1. Crear usuario médico en auth-service (directo, con internal key)
 *   2. Insertar médico en appointment-service (Prisma directo)
 *   3. Registrar paciente DNI 71132903
 *   4. Login médico + iniciar consulta + finalizar con datos de prueba
 * ============================================================================
 */

import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3000';
const INTERNAL_API_KEY = 'internal-dev-key-change-in-prod';

const ADMIN_CREDENTIALS = {
  email: 'admin@clinicax.com',
  password: 'Admin123!',
};

const DOCTOR_USER = {
  nombre: 'Dr. Test',
  apellido: 'Automático',
  dni: '88888888',
  email: 'test.doctor@clinicax.com',
  telefono: '999999999',
  password: 'Doctor123!',
  rol: 'MEDICO',
  username: 'dr.test.auto',
  shift: 'MANANA' as const,
  schedules: [
    { diaSemana: 1, horaInicio: '08:00', horaFin: '12:00', duracionSlot: 30 },
    { diaSemana: 2, horaInicio: '08:00', horaFin: '12:00', duracionSlot: 30 },
    { diaSemana: 3, horaInicio: '08:00', horaFin: '12:00', duracionSlot: 30 },
    { diaSemana: 4, horaInicio: '08:00', horaFin: '12:00', duracionSlot: 30 },
    { diaSemana: 5, horaInicio: '08:00', horaFin: '12:00', duracionSlot: 30 },
  ],
};

const PATIENT_DATA = {
  dni: '71132903',
  email: 'anrrous.work@gmail.com',
  password: 'Arthuro71132902',
  nombre: 'Andrés',
  apellido: 'Pineda',
  telefono: '987654321',
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

async function apiCall(method: string, path: string, body?: any, token?: string, baseUrl?: string, extraHeaders?: Record<string, string>) {
  const url = `${baseUrl || BASE_URL}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(
      `HTTP ${res.status} en ${path}: ${data?.error?.mensaje || data?.message || res.statusText}`
    );
    (err as any).status = res.status;
    (err as any).response = data;
    throw err;
  }
  return data;
}

async function login(credentials: any) {
  return apiCall('POST', '/api/auth/login', credentials);
}

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
    const specialtiesRes = await apiCall('GET', '/api/admin/specialties', null, adminToken);
    const specialties = specialtiesRes.data || [];
    const medicinaGeneral = specialties.find((s: any) => s.nombre.toLowerCase().includes('medicina general'));
    if (!medicinaGeneral) {
      console.error('   ❌ No se encontró especialidad "Medicina General".');
      process.exit(1);
    }
    console.log(`   ✅ Especialidad "Medicina General" ID: ${medicinaGeneral.id}\n`);

    // ── 3. Crear usuario médico en auth-service (directo) ───────────────────
    console.log('👨‍⚕️ 3. Creando usuario médico en auth-service...');
    let doctorUserId: string;
    try {
      const doctorAuthRes = await apiCall(
        'POST',
        '/api/auth/register',
        {
          dni: DOCTOR_USER.dni,
          email: DOCTOR_USER.email,
          password: DOCTOR_USER.password,
          nombre: DOCTOR_USER.nombre,
          apellido: DOCTOR_USER.apellido,
          telefono: DOCTOR_USER.telefono,
          rol: 'MEDICO',
        },
        undefined,
        AUTH_SERVICE_URL,
        { 'X-Internal-Api-Key': INTERNAL_API_KEY }
      );
      doctorUserId = doctorAuthRes.data.usuario.id;
      console.log(`   ✅ Usuario médico creado en auth-service (ID: ${doctorUserId})`);
    } catch (err: any) {
      if (err.status === 409) {
        console.log('   ⚠️ El usuario médico ya existe en auth-service. Intentando login...');
        const doctorLogin = await login({ email: DOCTOR_USER.email, password: DOCTOR_USER.password });
        doctorUserId = doctorLogin.data.usuario.id;
        console.log(`   ✅ Usuario médico recuperado (ID: ${doctorUserId})`);
      } else {
        throw err;
      }
    }
    console.log('');

    // ── 4. Insertar médico en appointment-service (Prisma directo) ──────────
    console.log('📅 4. Insertando médico en appointment-service...');
    const existingMedico = await prisma.medico.findUnique({
      where: { nombreUsuario: DOCTOR_USER.username },
    });
    let medicoId: string;
    if (existingMedico) {
      medicoId = existingMedico.id;
      console.log(`   ⚠️ Médico ya existe en appointment-service (ID: ${medicoId})`);
    } else {
      const medico = await prisma.medico.create({
        data: {
          usuarioId: doctorUserId,
          nombreUsuario: DOCTOR_USER.username,
          especialidadId: medicinaGeneral.id,
          turno: DOCTOR_USER.shift,
          activo: true,
          horarios: {
            create: DOCTOR_USER.schedules,
          },
        },
      });
      medicoId = medico.id;
      console.log(`   ✅ Médico insertado en appointment-service (ID: ${medicoId})`);
    }
    console.log('');

    // ── 5. Registrar paciente ───────────────────────────────────────────────
    console.log('🙋 5. Registrando paciente...');
    let patientRes: any;
    try {
      patientRes = await apiCall('POST', '/api/auth/register', PATIENT_DATA);
    } catch (err: any) {
      if (err.status === 409) {
        console.log('   ⚠️ El paciente ya existe. Intentando login...');
        patientRes = await login({ email: PATIENT_DATA.email, password: PATIENT_DATA.password });
      } else {
        throw err;
      }
    }
    const patientUser = patientRes.data.usuario;
    console.log(
      `   ✅ Paciente listo: ${patientUser.nombre} ${patientUser.apellido} (ID: ${patientUser.id}, DNI: ${patientUser.dni})\n`
    );

    // ── 6. Login médico ─────────────────────────────────────────────────────
    console.log('🔐 6. Login como médico...');
    const doctorLogin = await login({ email: DOCTOR_USER.email, password: DOCTOR_USER.password });
    const doctorToken = doctorLogin.data.token;
    console.log('   ✅ Médico autenticado.\n');

    // ── 7. Iniciar consulta ─────────────────────────────────────────────────
    console.log('🩺 7. Iniciando consulta...');
    const consultationRes = await apiCall(
      'POST',
      '/api/medical/doctor/consultation/start',
      {
        pacienteId: patientUser.id,
        motivoConsulta: 'Dolor abdominal leve',
      },
      doctorToken
    );
    const consultation = consultationRes.data;
    console.log(`   ✅ Consulta activa creada (ID: ${consultation.id})\n`);

    // ── 8. Finalizar consulta ───────────────────────────────────────────────
    console.log('💊 8. Finalizando consulta con diagnóstico, análisis y medicamentos...');
    const finalizeRes = await apiCall(
      'POST',
      `/api/medical/doctor/consultation/${consultation.id}/finalize`,
      FINALIZE_PAYLOAD,
      doctorToken
    );
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
    console.log(`      Pass:   ${PATIENT_DATA.password}`);
    console.log('');
    console.log('   👨‍⚕️ Médico:');
    console.log(`      Email:  ${DOCTOR_USER.email}`);
    console.log(`      Pass:   ${DOCTOR_USER.password}`);
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
  } catch (error: any) {
    console.error('\n❌ ERROR en el setup:\n', error.message || error);
    if (error.response) {
      console.error('   Detalle:', JSON.stringify(error.response, null, 2));
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
