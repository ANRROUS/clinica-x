import { api } from './axios';
import type { UsuarioDTO, ApiResponse } from './types';

export async function register(data: {
  dni: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono?: string;
}): Promise<ApiResponse<{ token: string; usuario: UsuarioDTO }>> {
  const res = await api.post('/api/auth/register', data);
  return res.data;
}

export async function login(data: {
  email: string;
  password: string;
  dni?: string;
}): Promise<ApiResponse<{ token: string; usuario: UsuarioDTO }>> {
  const res = await api.post('/api/auth/login', data);
  return res.data;
}

export async function logoutApi(): Promise<ApiResponse<{ message: string }>> {
  const res = await api.post('/api/auth/logout');
  return res.data;
}

export async function getMe(): Promise<ApiResponse<UsuarioDTO>> {
  const res = await api.get('/api/auth/me');
  return res.data;
}

export async function updateMe(data: {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  email?: string;
}): Promise<ApiResponse<UsuarioDTO>> {
  const res = await api.put('/api/auth/me', data);
  return res.data;
}

export async function forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
  const res = await api.post('/api/auth/forgot-password', { email });
  return res.data;
}

export async function resetPassword(
  token: string,
  nuevaContrasena: string,
): Promise<ApiResponse<{ message: string }>> {
  const res = await api.post('/api/auth/reset-password', { token, nuevaContrasena });
  return res.data;
}