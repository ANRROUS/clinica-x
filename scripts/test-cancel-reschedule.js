const GW = 'http://localhost:8080';
const PACIENTE_PASSWORD = process.env.PACIENTE_PASSWORD || 'Paciente123!';

async function f(url, opts = {}) {
  const r = await fetch(url, opts);
  const t = await r.text();
  try { return { s: r.status, b: JSON.parse(t) }; } catch { return { s: r.status, b: t }; }
}

(async () => {
  const uniq = Date.now().toString().slice(-6);
  const dni = '71' + uniq;
  const email = `p${uniq}@t.com`;

  // register
  let r = await f(`${GW}/api/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dni, email, password: PACIENTE_PASSWORD, nombre: 'P', apellido: 'T' }),
  });
  console.log('reg', r.s, r.b.success ? 'OK' : r.b.error?.mensaje);

  // login
  r = await f(`${GW}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dni, email, password: PACIENTE_PASSWORD }),
  });
  const tk = r.b.data?.token;
  console.log('login', r.s, tk ? 'OK' : 'FAIL');
  if (!tk) return;

  // automatic booking
  r = await f(`${GW}/api/appointments/book/automatic`, {
    method: 'POST', headers: { Authorization: `Bearer ${tk}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ especialidadId: '4c2dceed-452d-41e0-933b-a55c6cc70c8c' }),
  });
  const cita = r.b.data;
  console.log('auto', r.s, r.b.success ? 'OK' : r.b.error?.mensaje, cita?.id ? `id=${cita.id}` : '');

  // cancel
  if (cita) {
    r = await f(`${GW}/api/appointments/patient/${cita.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${tk}` } });
    console.log('cancel', r.s, r.b.success ? 'OK' : r.b.error?.mensaje);
  }

  // rebook automatic to test reschedule
  r = await f(`${GW}/api/appointments/book/automatic`, {
    method: 'POST', headers: { Authorization: `Bearer ${tk}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ especialidadId: '4c2dceed-452d-41e0-933b-a55c6cc70c8c' }),
  });
  const cita2 = r.b.data;
  console.log('auto2', r.s, r.b.success ? 'OK' : r.b.error?.mensaje, cita2?.id ? `id=${cita2.id}` : '');

  // reschedule
  if (cita2) {
    const nf = '2026-05-19T08:30:00Z';
    r = await f(`${GW}/api/appointments/patient/${cita2.id}`, {
      method: 'PUT', headers: { Authorization: `Bearer ${tk}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fechaHora: nf }),
    });
    console.log('reschedule', r.s, r.b.success ? 'OK' : r.b.error?.mensaje);
  }
})();
