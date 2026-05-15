/**
 * Roles del sistema. Coincide 1:1 con el enum Rol persistido en Prisma.
 */
export const RolValores = ['PACIENTE', 'MEDICO', 'ADMIN'] as const;

export type Rol = (typeof RolValores)[number];

export function esRolValido(valor: string): valor is Rol {
  return (RolValores as readonly string[]).includes(valor);
}
