/**
 * ============================================================================
 * PrismaConsultaRepository — Adaptador de persistencia
 * ============================================================================
 */

import { prisma } from '@/shared/prisma-client';
import { Consulta } from '@/modules/consultas/domain/entities/consulta.entity';
import type { OrdenAnalisisValue, MedicamentoValue } from '@/modules/consultas/domain/entities/consulta.entity';
import type { IConsultaRepository } from '@/modules/consultas/domain/ports/out/consulta.repository.port';
import type { EstadoConsulta } from '@clinica-x/shared-types';

const RELATIONS = {
  include: {
    ordenesAnalisis: true,
    medicamentos: true,
  } as const,
};

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

    // En estado FINALIZADA: persistir relaciones en una transacción
    if (consulta.estado === 'FINALIZADA') {
      const ordenesAnalisisData = consulta.ordenesAnalisis.map((o: OrdenAnalisisValue) => ({
        tipoAnalisis: o.tipoAnalisis,
        especialidad: o.especialidad ?? null,
        descripcion: o.descripcion ?? null,
        estado: 'PENDIENTE',
      }));

      const medicamentosData = consulta.medicamentos.map((m: MedicamentoValue) => ({
        nombre: m.nombre,
        dias: m.dias,
        frecuencia: m.frecuencia,
      }));

      const registro = await prisma.$transaction(async (tx) => {
        const actualizada = await tx.consulta.upsert({
          where: { id: consulta.id },
          update: data,
          create: data,
        });

        // Reemplazar órdenes de análisis
        await tx.ordenAnalisis.deleteMany({ where: { consultaId: consulta.id } });
        if (ordenesAnalisisData.length > 0) {
          await tx.ordenAnalisis.createMany({
            data: ordenesAnalisisData.map((o) => ({ ...o, consultaId: consulta.id })),
          });
        }

        // Reemplazar medicamentos
        await tx.medicamento.deleteMany({ where: { consultaId: consulta.id } });
        if (medicamentosData.length > 0) {
          await tx.medicamento.createMany({
            data: medicamentosData.map((m) => ({ ...m, consultaId: consulta.id })),
          });
        }

        return tx.consulta.findUnique({
          where: { id: consulta.id },
          ...RELATIONS,
        });
      });

      return this.toEntity(registro!);
    }

    // Para estado ACTIVA: solo upsert, sin tocar relaciones
    const registro = await prisma.consulta.upsert({
      where: { id: consulta.id },
      update: data,
      create: data,
    });

    return this.toEntity(registro);
  }

  async buscarPorId(id: string): Promise<Consulta | null> {
    const registro = await prisma.consulta.findUnique({ where: { id }, ...RELATIONS });
    if (!registro) return null;
    return this.toEntity(registro);
  }

  async buscarPorPaciente(pacienteId: string, estado?: EstadoConsulta): Promise<Consulta[]> {
    const registros = await prisma.consulta.findMany({
      where: { pacienteId, ...(estado ? { estado } : {}) },
      orderBy: { fechaInicio: 'desc' },
      ...RELATIONS,
    });
    return registros.map((r) => this.toEntity(r));
  }

  async buscarPorMedico(medicoId: string, estado?: EstadoConsulta): Promise<Consulta[]> {
    const registros = await prisma.consulta.findMany({
      where: { medicoId, ...(estado ? { estado } : {}) },
      orderBy: { fechaInicio: 'desc' },
      ...RELATIONS,
    });
    return registros.map((r) => this.toEntity(r));
  }

  async buscarActivaPorPacienteYMedico(pacienteId: string, medicoId: string): Promise<Consulta | null> {
    const registro = await prisma.consulta.findFirst({
      where: { pacienteId, medicoId, estado: 'ACTIVA' },
      ...RELATIONS,
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
      ...RELATIONS,
    });
    return registros.map((r) => this.toEntity(r));
  }

  async actualizarOrdenAnalisis(id: string, data: { archivoId: string; resultado?: string; estado?: string }): Promise<void> {
    await prisma.ordenAnalisis.update({
      where: { id },
      data: {
        archivoId: data.archivoId,
        resultado: data.resultado ?? null,
        estado: data.estado ?? 'COMPLETADA',
      },
    });
  }

  async buscarOrdenAnalisisPorId(id: string): Promise<{ id: string; consultaId: string; tipoAnalisis: string; estado: string } | null> {
    const orden = await prisma.ordenAnalisis.findUnique({
      where: { id },
      select: { id: true, consultaId: true, tipoAnalisis: true, estado: true },
    });
    return orden;
  }

  async buscarResultadosAnalisisPorPaciente(pacienteId: string, biomarcador?: string): Promise<any[]> {
    const where: any = {
      pacienteId,
      estadoOcr: 'COMPLETADO',
    };
    if (biomarcador) {
      where.grupos = {
        some: {
          items: {
            some: {
              nombre: { contains: biomarcador, mode: 'insensitive' },
            },
          },
        },
      };
    }
    return prisma.analisisResultado.findMany({
      where,
      include: {
        grupos: {
          orderBy: { orden: 'asc' },
          include: {
            items: {
              orderBy: { orden: 'asc' },
            },
          },
        },
      },
      orderBy: { fechaResultado: 'asc' },
    });
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private toEntity(registro: any): Consulta {
    const ordenesAnalisis: OrdenAnalisisValue[] = (registro.ordenesAnalisis ?? []).map((o: any) => ({
      id: o.id,
      tipoAnalisis: o.tipoAnalisis,
      especialidad: o.especialidad ?? undefined,
      descripcion: o.descripcion ?? undefined,
      estado: o.estado ?? undefined,
      archivoId: o.archivoId ?? undefined,
      analisisResultadoId: o.analisisResultadoId ?? undefined,
    }));

    const medicamentos: MedicamentoValue[] = (registro.medicamentos ?? []).map((m: any) => ({
      id: m.id,
      nombre: m.nombre,
      dias: m.dias,
      frecuencia: m.frecuencia,
    }));

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
      ordenesAnalisis,
      medicamentos,
    });
    if (resultado.isErr) {
      throw resultado.error;
    }
    return resultado.value;
  }
}
