export interface AuditUrl {
  id: string;
  name: string;
  path: string;
  type: 'public' | 'protected';
  role?: 'paciente' | 'medico' | 'admin';
  hu: string[];
  rf: string[];
  description: string;
}

export const FRONTEND_URL = process.env.FRONTEND_URL ?? 'https://clinica-x.up.railway.app';
export const API_URL = process.env.API_URL ?? 'https://backend-clinica.up.railway.app/api';

export const AUDIT_URLS: AuditUrl[] = [
  {
    id: 'US-01',
    name: 'Landing Page',
    path: '/',
    type: 'public',
    hu: ['HU-P01'],
    rf: ['RF-04'],
    description: 'Página de inicio pública con catálogo de especialidades',
  },
  {
    id: 'US-02',
    name: 'Login Paciente',
    path: '/login',
    type: 'public',
    hu: ['HU-P02'],
    rf: ['RF-01'],
    description: 'Formulario de inicio de sesión para pacientes',
  },
  {
    id: 'US-03',
    name: 'Registro Paciente',
    path: '/register',
    type: 'public',
    hu: ['HU-P02'],
    rf: ['RF-01'],
    description: 'Formulario de registro de nuevo paciente',
  },
  {
    id: 'US-04',
    name: 'Reservar Cita',
    path: '/reservar-cita',
    type: 'protected',
    role: 'paciente',
    hu: ['HU-P03', 'HU-P04'],
    rf: ['RF-05', 'RF-06'],
    description: 'Flujo de reserva de cita (manual y automática)',
  },
  {
    id: 'US-05',
    name: 'Perfil Paciente',
    path: '/perfil',
    type: 'protected',
    role: 'paciente',
    hu: ['HU-P05', 'HU-P06'],
    rf: ['RF-07'],
    description: 'Perfil del paciente con reservas y datos',
  },
  {
    id: 'US-06',
    name: 'Login Admin',
    path: '/admin/login',
    type: 'public',
    hu: ['HU-A01'],
    rf: ['RF-02'],
    description: 'Formulario de inicio de sesión para administradores',
  },
  {
    id: 'US-07',
    name: 'Dashboard Admin',
    path: '/admin/dashboard',
    type: 'protected',
    role: 'admin',
    hu: ['HU-A05'],
    rf: ['RF-02'],
    description: 'Panel de administración con KPIs y listado de médicos',
  },
  {
    id: 'US-08',
    name: 'Nuevo Doctor',
    path: '/admin/doctors/new',
    type: 'protected',
    role: 'admin',
    hu: ['HU-A01'],
    rf: ['RF-02', 'RF-03'],
    description: 'Formulario de registro de nuevo médico con horarios',
  },
  {
    id: 'US-09',
    name: 'Login Médico',
    path: '/doctor/login',
    type: 'public',
    hu: ['HU-M01'],
    rf: ['RF-01'],
    description: 'Formulario de inicio de sesión para médicos',
  },
  {
    id: 'US-10',
    name: 'Calendario Médico',
    path: '/doctor/calendario',
    type: 'protected',
    role: 'medico',
    hu: ['HU-M02'],
    rf: ['RF-11'],
    description: 'Calendario mensual/semanal/diario del médico',
  },
  {
    id: 'US-11',
    name: 'Pacientes Médico',
    path: '/doctor/pacientes',
    type: 'protected',
    role: 'medico',
    hu: ['HU-M04'],
    rf: ['RF-13'],
    description: 'Lista de pacientes del médico con segmentación',
  },
  {
    id: 'US-12',
    name: 'Login Error',
    path: '/login',
    type: 'public',
    hu: ['HU-P02'],
    rf: ['RF-01'],
    description: 'Página de login mostrando mensaje de error (usabilidad de retroalimentación)',
  },
];

export const CREDENTIALS = {
  paciente: {
    email: 'lu.a.tru.sul@gmail.com',
    password: process.env['PACIENTE_PASSWORD'] ?? '',
    dni: '70364946',
  },
  medico: {
    email: '22222222@gmail.com',
    password: process.env['MEDICO_PASSWORD'] ?? '',
  },
  admin: {
    email: 'admin@clinicax.com',
    password: process.env['ADMIN_PASSWORD'] ?? '',
  },
};