/**
 * ============================================================================
 * PrismaCitaRepository — Adaptador de salida de persistencia
 * ============================================================================
 */

import { prisma } from '@/shared/prisma-client';
import { Prisma } from '@/generated/prisma';
import { Cita } from '@/modules/citas/domain/entities/cita.entity';
import type { ICitaRepository } from '@/modules/citas/domain/ports/out/cita.repository.port';
import { parseLimaDate } from '@clinica-x/date-utils';
import { logger } from '@/shared/logger';

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

  async buscarPorPacienteMedicoYDia(
    pacienteId: string,
    medicoId: string,
    fechaInicio: Date,
    fechaFin: Date,
  ): Promise<Cita[]> {
    const raws = await prisma.cita.findMany({
      where: {
        pacienteId,
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

  async buscarPorMedicosYFecha(medicoIds: string[], fechaInicio: Date, fechaFin: Date): Promise<Cita[]> {
    if (medicoIds.length === 0) return [];
    const raws = await prisma.cita.findMany({
      where: {
        medicoId: { in: medicoIds },
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

  async guardarSiLibre(cita: Cita, inicioRango: Date, finRango: Date): Promise<boolean> {
    try {
      await prisma.$transaction(async (tx) => {
        const ocupadas = await tx.cita.count({
          where: {
            medicoId: cita.medicoId,
            fechaHora: {
              gt: inicioRango,
              lt: finRango,
            },
            estado: { not: 'CANCELADA' },
          },
        });

        if (ocupadas > 0) {
          throw new Error('Slot ocupado');
        }

        const citaCancelada = await tx.cita.findFirst({
          where: {
            medicoId: cita.medicoId,
            fechaHora: cita.fechaHora,
            estado: 'CANCELADA',
          },
        });

        if (citaCancelada) {
          await tx.cita.update({
            where: { id: citaCancelada.id },
            data: {
              pacienteId: cita.pacienteId,
              estado: cita.estado,
              tipoReserva: cita.tipoReserva,
              motivo: cita.motivo,
            },
          });
        } else {
          await tx.cita.create({
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
      });
      return true;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        logger.warn({
          msg: 'Unique constraint violation al crear cita (race condition)',
          meta: err.meta,
          medicoId: cita.medicoId,
          fechaHora: cita.fechaHora,
        });
      } else if (err instanceof Error && err.message === 'Slot ocupado') {
        logger.debug({
          msg: 'Slot ocupado detectado en guardarSiLibre',
          medicoId: cita.medicoId,
          fechaHora: cita.fechaHora,
        });
      } else {
        logger.error({
          msg: 'Error inesperado en guardarSiLibre',
          err,
          medicoId: cita.medicoId,
          fechaHora: cita.fechaHora,
        });
      }
      return false;
    }
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

  async actualizarSiLibre(cita: Cita, inicioRango: Date, finRango: Date): Promise<boolean> {
    try {
      await prisma.$transaction(async (tx) => {
        const ocupadas = await tx.cita.count({
          where: {
            medicoId: cita.medicoId,
            id: { not: cita.id },
            fechaHora: {
              gt: inicioRango,
              lt: finRango,
            },
            estado: { not: 'CANCELADA' },
          },
        });

        if (ocupadas > 0) {
          throw new Error('Slot ocupado');
        }

        await tx.cita.update({
          where: { id: cita.id },
          data: {
            fechaHora: cita.fechaHora,
            estado: cita.estado,
            motivo: cita.motivo,
          },
        });
      });
      return true;
    } catch {
      return false;
    }
  }

  async eliminar(id: string): Promise<void> {
    await prisma.cita.delete({ where: { id } });
  }

  private toDomain(raw: any): Cita {
    const result = Cita.create(raw.id, {
      pacienteId: raw.pacienteId,
      medicoId: raw.medicoId,
      fechaHora: parseLimaDate(raw.fechaHora),
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
