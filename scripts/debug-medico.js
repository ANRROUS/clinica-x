const GATEWAY = 'http://localhost:8080';

const ADMIN_DNI = process.env.ADMIN_DNI || '00000000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@clinicax.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';

async function login() {
  const r = await fetch(`${GATEWAY}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dni: ADMIN_DNI, email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const d = await r.json();
  return d.data.token;
}

async function main() {
  const token = await login();
  const body = {
    dni: '11223344', nombre: 'Test', apellido: 'Médico', email: 'medico_test@clinicax.com',
    telefono: '888888888', especialidadId: '4c2dceed-452d-41e0-933b-a55c6cc70c8c',
    horarios: [{ diaSemana: 1, turno: 'MANANA', horaInicio: '08:00', horaFin: '12:00' }],
  };
  const r = await fetch(`${GATEWAY}/api/admin/doctors`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  const d = await r.json();
  console.log('Status:', r.status);
  console.log('Success:', d.success);
  if (d.error) console.log('Error:', d.error.codigo || d.error.mensaje);
}

main().catch(console.error);
