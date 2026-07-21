export const CREDENTIALS = {
  admin: {
    email: 'admin@clinicax.com',
    password: process.env.ADMIN_PASSWORD ?? 'Admin123!',
  },
  medico: {
    email: 'maria.garcia@clinicax.com',
    password: process.env.MEDICO_PASSWORD ?? 'Medico123!',
  },
  paciente: {
    dni: '70364946',
    email: 'lu.a.tru.sul@gmail.com',
    password: process.env.PACIENTE_PASSWORD ?? '12345678',
  },
  paciente2: {
    dni: '72029832',
    email: 'lauracabezass@gmail.com',
    password: process.env.PACIENTE_PASSWORD ?? '12345678',
  },
  nuevoPaciente: () => {
    const suffix = Date.now().toString().slice(-8);
    return {
      nombre: 'Nuevo',
      apellido: 'Paciente',
      dni: suffix,
      email: `nuevo.paciente.${suffix}@test.com`,
      password: process.env.NUEVO_PACIENTE_PASSWORD ?? 'Test1234!',
    };
  },
};

export const URLS = {
  base: process.env.FRONTEND_URL ?? 'http://localhost:3100',
  loginPaciente: '/login',
  register: '/register',
  reservarCita: '/reservar-cita',
  perfil: '/perfil',
  doctorLogin: '/doctor/login',
  doctorCalendario: '/doctor/calendario',
  doctorPacientes: '/doctor/pacientes',
  adminLogin: '/admin/login',
  adminDashboard: '/admin/dashboard',
  adminNuevoDoctor: '/admin/doctors/new',
};
