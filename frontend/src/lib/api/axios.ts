/**
 * Cliente Axios apuntando al api-gateway.
 *
 * Cada rol (paciente, médico, admin) tiene su propio token en localStorage
 * bajo una clave distinta. La función `getActiveToken` decide cuál usar
 * según la ruta actual del navegador.
 */
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

export const TOKEN_KEYS = {
  paciente: 'clinica_x_token',
  medico: 'clinica_x_doctor_token',
  admin: 'clinica_x_admin_token',
} as const;

/**
 * Devuelve el token vigente según la ruta del navegador.
 * Si no estamos en browser (SSR), retorna null.
 */
function getActiveToken(): string | null {
  if (typeof window === 'undefined') return null;
  const path = window.location.pathname;
  if (path.startsWith('/admin')) return localStorage.getItem(TOKEN_KEYS.admin);
  if (path.startsWith('/doctor')) return localStorage.getItem(TOKEN_KEYS.medico);
  return localStorage.getItem(TOKEN_KEYS.paciente);
}

export const api = axios.create({
  baseURL,
  timeout: 15_000,
});

api.interceptors.request.use((config) => {
  const token = getActiveToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (resp) => resp,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      // Token inválido o expirado: limpiar y redirigir al login del rol actual
      const path = window.location.pathname;
      if (path.startsWith('/admin')) {
        localStorage.removeItem(TOKEN_KEYS.admin);
        if (path !== '/admin/login') window.location.href = '/admin/login';
      } else if (path.startsWith('/doctor')) {
        localStorage.removeItem(TOKEN_KEYS.medico);
        if (path !== '/doctor/login') window.location.href = '/doctor/login';
      } else {
        localStorage.removeItem(TOKEN_KEYS.paciente);
        if (path !== '/login') window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
