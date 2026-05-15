/**
 * Estados y enums compartidos entre servicios.
 */

// --- Cita / Appointment ---
export const EstadoCitaValores = [
  'CONFIRMADA',
  'EN_ATENCION',
  'COMPLETADA',
  'CANCELADA',
] as const;
export type EstadoCita = (typeof EstadoCitaValores)[number];

export const TipoReservaValores = ['MANUAL', 'AUTOMATICA'] as const;
export type TipoReserva = (typeof TipoReservaValores)[number];

// --- Médico ---
export const TurnoValores = ['MANANA', 'TARDE'] as const;
export type Turno = (typeof TurnoValores)[number];

// --- Consulta / Clinical ---
export const EstadoConsultaValores = ['ACTIVA', 'FINALIZADA'] as const;
export type EstadoConsulta = (typeof EstadoConsultaValores)[number];

// --- Días de la semana usados en horarios ---
export const DiaSemanaValores = [1, 2, 3, 4, 5] as const; // Lunes a Viernes
export type DiaSemana = (typeof DiaSemanaValores)[number];
