const http = require('http');

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function main() {
  // 1. Login admin
  const loginRes = await request(
    { hostname: 'localhost', port: 3000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    JSON.stringify({ dni: '00000000', email: 'admin@clinicax.com', password: 'Admin123!' })
  );
  console.log('LOGIN:', loginRes.status);
  const loginData = JSON.parse(loginRes.body);
  const token = loginData.data?.token;
  if (!token) {
    console.log('Login falló:', loginRes.body);
    return;
  }

  // 2. Listar médicos
  const listRes = await request(
    { hostname: 'localhost', port: 3001, path: '/api/admin/doctors', method: 'GET', headers: { Authorization: `Bearer ${token}` } }
  );
  console.log('LIST DOCTORS:', listRes.status, listRes.body);

  // 3. Crear médico
  const createRes = await request(
    { hostname: 'localhost', port: 3001, path: '/api/admin/doctors', method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } },
    JSON.stringify({
      nombre: 'Anghelina',
      apellido: 'Alva',
      dni: '71132904',
      email: 'doctor1@clinicax.com',
      telefono: '956123456',
      username: 'drAnghelina',
      specialtyId: '4c2dceed-452d-41e0-933b-a55c6cc70c8c', // Medicina General
      shift: 'MANANA',
      password: 'Doctor123!',
      schedules: [
        { diaSemana: 1, horaInicio: '08:00', horaFin: '08:30' },
        { diaSemana: 1, horaInicio: '08:30', horaFin: '09:00' },
        { diaSemana: 3, horaInicio: '08:00', horaFin: '08:30' },
      ],
    })
  );
  console.log('CREATE DOCTOR:', createRes.status, createRes.body);

  // 4. Listar médicos de nuevo
  const list2 = await request(
    { hostname: 'localhost', port: 3001, path: '/api/admin/doctors', method: 'GET', headers: { Authorization: `Bearer ${token}` } }
  );
  console.log('LIST DOCTORS 2:', list2.status, list2.body);
}

main().catch(console.error);
