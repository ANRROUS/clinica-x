import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import { useDoctorAuthStore } from '@/store/useDoctorAuthStore';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

const PATIENT_TOKEN_KEY = 'clinica_x_token';
const PATIENT_USER_KEY = 'clinica_x_user';
const DOCTOR_TOKEN_KEY = 'clinica_x_doctor_token';
const DOCTOR_USER_KEY = 'clinica_x_doctor_user';
const ADMIN_TOKEN_KEY = 'clinica_x_admin_token';
const ADMIN_USER_KEY = 'clinica_x_admin_user';

type Role = 'paciente' | 'medico' | 'admin' | null;

function getActiveRole(pathname: string): Role {
  if (pathname.startsWith('/doctor')) return 'medico';
  if (pathname.startsWith('/admin')) return 'admin';
  if (
    pathname === '/perfil' ||
    pathname.startsWith('/perfil/') ||
    pathname === '/reservar-cita' ||
    pathname.startsWith('/reservar-cita/')
  ) return 'paciente';
  return null;
}

function getTokenForRole(role: Role): string | null {
  if (typeof window === 'undefined') return null;
  switch (role) {
    case 'paciente':
      return localStorage.getItem(PATIENT_TOKEN_KEY);
    case 'medico':
      return localStorage.getItem(DOCTOR_TOKEN_KEY);
    case 'admin':
      return localStorage.getItem(ADMIN_TOKEN_KEY);
    default:
      return null;
  }
}

function getFallbackToken(): string | null {
  if (typeof window === 'undefined') return null;
  const patient = localStorage.getItem(PATIENT_TOKEN_KEY);
  if (patient) return patient;
  const doctor = localStorage.getItem(DOCTOR_TOKEN_KEY);
  if (doctor) return doctor;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

function clearRoleStorage(role: Role) {
  if (typeof window === 'undefined') return;
  switch (role) {
    case 'paciente':
      localStorage.removeItem(PATIENT_TOKEN_KEY);
      localStorage.removeItem(PATIENT_USER_KEY);
      document.cookie = 'clinica_x_token=; path=/; max-age=0; SameSite=Lax';
      document.cookie = 'auth_role=; path=/; max-age=0; SameSite=Lax';
      useAuthStore.getState().clearAuth();
      break;
    case 'medico':
      localStorage.removeItem(DOCTOR_TOKEN_KEY);
      localStorage.removeItem(DOCTOR_USER_KEY);
      document.cookie = 'clinica_x_doctor_token=; path=/; max-age=0; SameSite=Lax';
      useDoctorAuthStore.getState().clearAuth();
      break;
    case 'admin':
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
      document.cookie = 'clinica_x_admin_token=; path=/; max-age=0; SameSite=Lax';
      useAdminAuthStore.getState().clearAuth();
      break;
  }
}

export const api = axios.create({
  baseURL,
  timeout: 30_000,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const role = getActiveRole(window.location.pathname);
      const token = role ? getTokenForRole(role) : getFallbackToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (resp) => resp,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      const role = getActiveRole(window.location.pathname);
      clearRoleStorage(role);

      const pathname = window.location.pathname;
      if (pathname.startsWith('/doctor')) {
        window.location.href = '/doctor/login';
      } else if (pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);