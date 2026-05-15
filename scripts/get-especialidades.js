const GATEWAY = 'http://localhost:8080';

async function login() {
  const res = await fetch(`${GATEWAY}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dni: '00000000', email: 'admin@clinicax.com', password: 'Admin123!' }),
  });
  const data = await res.json();
  return data.data.token;
}

async function main() {
  const token = await login();
  console.log('Admin token OK');

  // Listar especialidades
  const res = await fetch(`${GATEWAY}/api/admin/doctors`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (data.success && data.data?.especialidades) {
    console.log('Especialidades:');
    for (const e of data.data.especialidades.slice(0, 3)) {
      console.log(`  ${e.id} — ${e.nombre}`);
    }
  } else {
    console.log('No se encontraron especialidades. Creando una...');
  }

  // Verificar si existe médico test
  const doctors = await fetch(`${GATEWAY}/api/admin/doctors`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const docData = await doctors.json();
  console.log('\nMédicos existentes:', docData.data?.medicos?.length || 0);
  for (const m of (docData.data?.medicos || []).slice(0, 2)) {
    console.log(`  ${m.id} — ${m.nombre} ${m.apellido} — ${m.usuario.email}`);
  }
}

main().catch(console.error);
