/**
 * ============================================================================
 * PrismaCitaRepository — Adaptador de salida de persistencia
 * ============================================================================
 */

import { prisma } from '@/shared/prisma-client';
import { Cita } from '@/modules/citas/domain/entities/cita.entity';
import type { ICitaRepository } from '@/modules/citas/domain/ports/out/cita.repository.port';

export class PrismaCitaRepository implements ICitaRepository {
  async guardar(cita: Cita): Promise<void> {
    await prisma.cita.create({
      data: {
        id: cita.id,
        pacienteId: cita.pacienteId,
        medicoId: cita.medicoId,
        fechaHora: cita.fechaHora,
        estado: cita.estado,
        tipoReserva: cita.tipoReserva,
        motivo: cita.motivo,
      },
    });
  }

  async buscarPorId(id: string): Promise<Cita | null> {
    const raw = await prisma.cita.findUnique({ where: { id } });
    return raw ? this.toDomain(raw) : null;
  }

  async buscarPorPaciente(pacienteId: string): Promise<Cita[]> {
    const raws = await prisma.cita.findMany({
      where: { pacienteId },
      orderBy: { fechaHora: 'desc' },
    });
    return raws.map((r: any) => this.toDomain(r));
  }

  async buscarPorMedico(medicoId: string, fechaDesde?: Date, fechaHasta?: Date): Promise<Cita[]> {
    const where: any = { medicoId };
    if (fechaDesde || fechaHasta) {
      where.fechaHora = {};
      if (fechaDesde) where.fechaHora.gte = fechaDesde;
      if (fechaHasta) where.fechaHora.lte = fechaHasta;
    }
    const raws = await prisma.cita.findMany({
      where,
      orderBy: { fechaHora: 'asc' },
    });
    return raws.map((r: any) => this.toDomain(r));
  }

  async buscarPorMedicoYFecha(medicoId: string, fechaInicio: Date, fechaFin: Date): Promise<Cita[]> {
    const raws = await prisma.cita.findMany({
      where: {
        medicoId,
        fechaHora: {
          gte: fechaInicio,
          lte: fechaFin,
        },
        estado: { not: 'CANCELADA' },
      },
      orderBy: { fechaHora: 'asc' },
    });
    return raws.map((r: any) => this.toDomain(r));
  }

  async contarCitasEnRango(medicoId: string, inicio: Date, fin: Date): Promise<number> {
    return prisma.cita.count({
      where: {
        medicoId,
        fechaHora: {
          gt: inicio,
          lt: fin,
        },
        estado: { not: 'CANCELADA' },
      },
    });
  }

  async actualizar(cita: Cita): Promise<void> {
    await prisma.cita.update({
      where: { id: cita.id },
      data: {
        fechaHora: cita.fechaHora,
        estado: cita.estado,
        motivo: cita.motivo,
      },
    });
  }

  async eliminar(id: string): Promise<void> {
    await prisma.cita.delete({ where: { id } });
  }

  private toDomain(raw: any): Cita {
    const result = Cita.create(raw.id, {
      pacienteId: raw.pacienteId,
      medicoId: raw.medicoId,
      fechaHora: new Date(raw.fechaHora),
      estado: raw.estado,
      tipoReserva: raw.tipoReserva,
      motivo: raw.motivo,
    });
    if (result.isErr) {
      throw new Error('Error reconstruyendo Cita desde BD: ' + result.error.message);
    }
    return result.value;
  }
}
