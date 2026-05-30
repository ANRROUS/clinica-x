/**
 * Cliente Axios apuntando al api-gateway.
 *
 * La autenticacion se maneja mediante cookie httpOnly `auth_token`
 * seteada por auth-service en el login. Axios la envia automaticamente
 * con `withCredentials: true`.
 */
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

export const api = axios.create({
  baseURL,
  timeout: 15_000,
  withCredentials: true,
});

api.interceptors.response.use(
  (resp) => resp,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('clinica_x_user');
      document.cookie = 'auth_role=; path=/; max-age=0; SameSite=Lax';
    }
    return Promise.reject(error);
  },
);
