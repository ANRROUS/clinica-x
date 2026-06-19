import { API_URL, CREDENTIALS } from '../config/urls.js';

interface LoginResponse {
  success: boolean;
  data?: {
    token: string;
    usuario: {
      id: string;
      dni: string;
      email: string;
      nombre: string;
      apellido: string;
      telefono?: string;
      rol: string;
    };
  };
  error?: { codigo: string; mensaje: string };
}

export interface AuthToken {
  token: string;
  rol: string;
  email: string;
}

export async function loginAsPaciente(): Promise<AuthToken> {
  return login(CREDENTIALS.paciente.email, CREDENTIALS.paciente.password, CREDENTIALS.paciente.dni);
}

export async function loginAsMedico(): Promise<AuthToken> {
  return login(CREDENTIALS.medico.email, CREDENTIALS.medico.password);
}

export async function loginAsAdmin(): Promise<AuthToken> {
  return login(CREDENTIALS.admin.email, CREDENTIALS.admin.password);
}

async function login(email: string, password: string, dni?: string): Promise<AuthToken> {
  const body: Record<string, string> = { email, password };
  if (dni) body.dni = dni;

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Login failed (${response.status}): ${text}`);
  }

  const json = (await response.json()) as LoginResponse;

  if (!json.success || !json.data) {
    throw new Error(`Login failed: ${json.error?.mensaje ?? 'Unknown error'}`);
  }

  return {
    token: json.data.token,
    rol: json.data.usuario.rol,
    email: json.data.usuario.email,
  };
}