/**
 * ============================================================================
 * Mapper entre la entidad de dominio Medico y los DTOs públicos
 * ============================================================================
 */

import type { Medico } from '../domain/entities/medico.entity';
import type { HorarioMedico } from '../domain/value-objects/horario-medico.vo';
import type { MedicoResponseDto, HorarioMedicoResponseDto } from '../domain/ports/in/medicos.port';

export function toMedicoResponseDto(
  medico: Medico,
  horarios: HorarioMedico[],
  especialidadNombre: string,
  datosPersonales: {
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    telefono?: string;
  },
): MedicoResponseDto {
  return {
    id: medico.id,
    usuarioId: medico.usuarioId,
    nombre: datosPersonales.nombre,
    apellido: datosPersonales.apellido,
    dni: datosPersonales.dni,
    email: datosPersonales.email,
    telefono: datosPersonales.telefono,
    username: medico.nombreUsuario,
    specialty: especialidadNombre,
    specialtyId: medico.especialidadId,
    shift: medico.turno,
    activo: medico.activo,
    schedules: horarios.map(toHorarioMedicoResponseDto),
  };
}

export function toHorarioMedicoResponseDto(h: HorarioMedico): HorarioMedicoResponseDto {
  return {
    id: crypto.randomUUID(), // Se sobreescribe con el id real de BD en el repo
    diaSemana: h.diaSemana,
    horaInicio: h.horaInicio,
    horaFin: h.horaFin,
    duracionSlot: h.duracionSlot,
  };
}
