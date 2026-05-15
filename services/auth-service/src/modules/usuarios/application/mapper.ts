/**
 * ============================================================================
 * Mapper entre la entidad de dominio Usuario y los DTOs públicos
 * ============================================================================
 * El mapper es un simple transformador de datos. No tiene lógica de negocio.
 * ============================================================================
 */

import type { Usuario } from '../domain/entities/usuario.entity';
import type { UsuarioResponseDto } from '../domain/ports/in/usuarios.port';

export function toUsuarioResponseDto(usuario: Usuario): UsuarioResponseDto {
  return {
    id: usuario.id,
    dni: usuario.dni.value,
    email: usuario.email.value,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    telefono: usuario.telefono,
    rol: usuario.rol,
  };
}
