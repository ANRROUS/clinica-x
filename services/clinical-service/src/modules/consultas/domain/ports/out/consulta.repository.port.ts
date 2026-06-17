/**
 * ============================================================================
 * Port de salida — Repositorio de consultas
 * ============================================================================
 */

import type { Consulta } from '../../entities/consulta.entity';
import type { EstadoConsulta } from '@clinica-x/shared-types';

export interface IConsultaRepository {
  guardar(consulta: Consulta): Promise<Consulta>;
  buscarPorId(id: string): Promise<Consulta | null>;
  buscarPorPaciente(pacienteId: string, estado?: EstadoConsulta): Promise<Consulta[]>;
  buscarPorMedico(medicoId: string, estado?: EstadoConsulta): Promise<Consulta[]>;
  buscarActivaPorPacienteYMedico(pacienteId: string, medicoId: string): Promise<Consulta | null>;
  listar(filtros: {
    pacienteId?: string;
    medicoId?: string;
    estado?: EstadoConsulta;
    fechaDesde?: Date;
    fechaHasta?: Date;
  }): Promise<Consulta[]>;
  actualizarOrdenAnalisis(id: string, data: { archivoId: string; resultado?: string; estado?: string }): Promise<void>;
  buscarOrdenAnalisisPorId(id: string): Promise<{ id: string; consultaId: string; tipoAnalisis: string; estado: string } | null>;
  buscarResultadosAnalisisPorPaciente(pacienteId: string, biomarcador?: string): Promise<any[]>;
}
