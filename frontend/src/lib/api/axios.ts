/**
 * Cliente Axios apuntando al api-gateway.
 *
 * La autenticacion se maneja mediante JWT almacenado en localStorage.
 * El interceptor de request inyecta el header Authorization automáticamente.
 * El interceptor de response limpia el estado si el token expira (401).
 */
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';
const TOKEN_KEY = 'clinica_x_token';
const USER_KEY = 'clinica_x_user';

export const api = axios.create({
  baseURL,
  timeout: 15_000,
  withCredentials: true,
});

// Interceptor request: inyectar Authorization header si hay token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor response: limpiar estado en 401
api.interceptors.response.use(
  (resp) => resp,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      document.cookie = 'clinica_x_token=; path=/; max-age=0; SameSite=Lax';
      document.cookie = 'auth_role=; path=/; max-age=0; SameSite=Lax';
    }
    return Promise.reject(error);
  },
);
