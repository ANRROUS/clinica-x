import type { Rol } from './roles';

/**
 * DTO público del usuario. Lo retorna /api/auth/me y se incluye en respuestas
 * de login. NO contiene password ni datos sensibles.
 */
export interface UsuarioDTO {
  id: string;
  dni: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  rol: Rol;
}
