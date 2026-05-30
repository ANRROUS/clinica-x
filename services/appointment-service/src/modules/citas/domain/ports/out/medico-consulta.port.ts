/**
 * ============================================================================
 * Puerto de consulta de médicos (read-only) para el módulo de citas
 * ============================================================================
 * Evita acoplamiento directo entre los módulos de citas y médicos.
 * ============================================================================
 */

export interface MedicoConsulta {
  id: string;
  nombreUsuario: string;
  activo: boolean;
  especialidadNombre: string;
  usuarioId: string;
}

export interface HorarioConsulta {
  horaInicio: string; // "08:00"
  horaFin: string;    // "12:00"
  duracionSlot: number;
}

export interface EspecialidadDTO {
  id: string;
  nombre: string;
}

export interface IMedicoConsultaPort {
  buscarPorId(medicoId: string): Promise<MedicoConsulta | null>;
  buscarPorIds(medicoIds: string[]): Promise<Map<string, MedicoConsulta>>;
  buscarPorUsuarioId(usuarioId: string): Promise<MedicoConsulta | null>;
  buscarPorEspecialidadActiva(especialidadId: string): Promise<MedicoConsulta[]>;
  listarHorarios(medicoId: string, diaSemana: number): Promise<HorarioConsulta[]>;
  /** Obtiene todos los horarios de varios médicos para varios días de la semana en una sola query. */
  listarHorariosPorMedicos(
    medicoIds: string[],
    diasSemana: number[],
  ): Promise<Map<string, HorarioConsulta[]>>;
  listarEspecialidades(): Promise<EspecialidadDTO[]>;
}
