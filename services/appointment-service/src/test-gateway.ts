import fetch from 'node-fetch';

const GW = 'http://localhost:8080';
const PACIENTE_PASSWORD = process.env.PACIENTE_PASSWORD || 'Paciente123!';

async function main() {
  const uniq = Date.now().toString().slice(-6);
  const dniPaciente = '71' + uniq;
  const emailPaciente = `paciente${uniq}@test.com`;

  console.log(`Registering new patient DNI: ${dniPaciente}, Email: ${emailPaciente}...`);
  const regRes = await fetch(`${GW}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dni: dniPaciente,
      email: emailPaciente,
      password: PACIENTE_PASSWORD,
      nombre: 'Paciente',
      apellido: 'Test'
    })
  });

  const regJson = await regRes.json() as any;
  if (!regJson.success) {
    console.error('Registration failed:', regJson.success, regJson.error?.mensaje || '');
    return;
  }
  console.log('Registration successful.');

  console.log('Logging in patient...');
  const loginRes = await fetch(`${GW}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dni: dniPaciente,
      email: emailPaciente,
      password: 'Paciente123!'
    })
  });
  
  const loginJson = await loginRes.json() as any;
  if (!loginJson.success) {
    console.error('Patient login failed:', loginJson.success, loginJson.error?.mensaje || '');
    return;
  }
  
  const token = loginJson.data.token;
  console.log('Patient login successful. Token acquired.');

  const specialtyId = '4c2dceed-452d-41e0-933b-a55c6cc70c8c';
  console.log(`Querying availability/specialty/${specialtyId} through gateway...`);
  
  const availRes = await fetch(`${GW}/api/appointments/availability/specialty/${encodeURIComponent(specialtyId)}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  console.log('Status Code:', availRes.status);
  const availJson = await availRes.json() as any;
  console.log('Response:', availJson.success, `(${availJson.data?.length ?? 0} doctors)`);
}

main().catch(console.error);
