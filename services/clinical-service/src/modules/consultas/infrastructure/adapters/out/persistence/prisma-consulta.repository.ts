/**
 * ============================================================================
 * PrismaConsultaRepository — Adaptador de persistencia
 * ============================================================================
 */

import { prisma } from '@/shared/prisma-client';
import { Consulta } from '@/modules/consultas/domain/entities/consulta.entity';
import type { IConsultaRepository } from '@/modules/consultas/domain/ports/out/consulta.repository.port';
import type { EstadoConsulta } from '@clinica-x/shared-types';

export class PrismaConsultaRepository implements IConsultaRepository {
  async guardar(consulta: Consulta): Promise<Consulta> {
    const data = {
      id: consulta.id,
      pacienteId: consulta.pacienteId,
      medicoId: consulta.medicoId,
      citaId: consulta.citaId ?? null,
      estado: consulta.estado,
      motivoConsulta: consulta.motivoConsulta ?? null,
      diagnostico: consulta.diagnostico ?? null,
      notas: consulta.notas ?? null,
      fechaInicio: consulta.fechaInicio,
      fechaFin: consulta.fechaFin ?? null,
    };

    const registro = await prisma.consulta.upsert({
      where: { id: consulta.id },
      update: data,
      create: data,
    });

    return this.toEntity(registro);
  }

  async buscarPorId(id: string): Promise<Consulta | null> {
    const registro = await prisma.consulta.findUnique({ where: { id } });
    if (!registro) return null;
    return this.toEntity(registro);
  }

  async buscarPorPaciente(pacienteId: string, estado?: EstadoConsulta): Promise<Consulta[]> {
    const registros = await prisma.consulta.findMany({
      where: { pacienteId, ...(estado ? { estado } : {}) },
      orderBy: { fechaInicio: 'desc' },
    });
    return registros.map((r) => this.toEntity(r));
  }

  async buscarPorMedico(medicoId: string, estado?: EstadoConsulta): Promise<Consulta[]> {
    const registros = await prisma.consulta.findMany({
      where: { medicoId, ...(estado ? { estado } : {}) },
      orderBy: { fechaInicio: 'desc' },
    });
    return registros.map((r) => this.toEntity(r));
  }

  async buscarActivaPorPacienteYMedico(pacienteId: string, medicoId: string): Promise<Consulta | null> {
    const registro = await prisma.consulta.findFirst({
      where: { pacienteId, medicoId, estado: 'ACTIVA' },
    });
    if (!registro) return null;
    return this.toEntity(registro);
  }

  async listar(filtros: {
    pacienteId?: string;
    medicoId?: string;
    estado?: EstadoConsulta;
    fechaDesde?: Date;
    fechaHasta?: Date;
  }): Promise<Consulta[]> {
    const registros = await prisma.consulta.findMany({
      where: {
        ...(filtros.pacienteId ? { pacienteId: filtros.pacienteId } : {}),
        ...(filtros.medicoId ? { medicoId: filtros.medicoId } : {}),
        ...(filtros.estado ? { estado: filtros.estado } : {}),
        ...(filtros.fechaDesde || filtros.fechaHasta
          ? {
              fechaInicio: {
                ...(filtros.fechaDesde ? { gte: filtros.fechaDesde } : {}),
                ...(filtros.fechaHasta ? { lte: filtros.fechaHasta } : {}),
              },
            }
          : {}),
      },
      orderBy: { fechaInicio: 'desc' },
    });
    return registros.map((r) => this.toEntity(r));
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private toEntity(registro: any): Consulta {
    const resultado = Consulta.create(registro.id, {
      pacienteId: registro.pacienteId,
      medicoId: registro.medicoId,
      citaId: registro.citaId ?? undefined,
      estado: registro.estado as EstadoConsulta,
      motivoConsulta: registro.motivoConsulta ?? undefined,
      diagnostico: registro.diagnostico ?? undefined,
      notas: registro.notas ?? undefined,
      fechaInicio: registro.fechaInicio,
      fechaFin: registro.fechaFin ?? undefined,
    });
    if (resultado.isErr) {
      throw resultado.error;
    }
    return resultado.value;
  }
}
