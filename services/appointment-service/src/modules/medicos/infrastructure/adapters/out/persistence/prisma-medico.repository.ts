/**
 * ============================================================================
 * PrismaMedicoRepository — Adaptador de salida de persistencia
 * ============================================================================
 */

import { prisma } from '@/shared/prisma-client';
import { Medico } from '@/modules/medicos/domain/entities/medico.entity';
import { HorarioMedico } from '@/modules/medicos/domain/value-objects/horario-medico.vo';
import type { IMedicoRepository } from '@/modules/medicos/domain/ports/out/medico.repository.port';

export class PrismaMedicoRepository implements IMedicoRepository {
  async guardar(medico: Medico): Promise<void> {
    await prisma.medico.create({
      data: {
        id: medico.id,
        usuarioId: medico.usuarioId,
        nombreUsuario: medico.nombreUsuario,
        especialidadId: medico.especialidadId,
        turno: medico.turno,
        activo: medico.activo,
      },
    });
  }

  async buscarPorId(id: string): Promise<any | null> {
    const raw = await prisma.medico.findUnique({
      where: { id },
      include: {
        especialidad: true,
        horarios: true,
      },
    });
    if (!raw) return null;
    return this.toDomain(raw);
  }

  async buscarPorNombreUsuario(nombreUsuario: string): Promise<Medico | null> {
    const raw = await prisma.medico.findUnique({
      where: { nombreUsuario },
    });
    return raw ? this.toDomainSimple(raw) : null;
  }

  async buscarPorUsuarioId(usuarioId: string): Promise<Medico | null> {
    const raw = await prisma.medico.findUnique({
      where: { usuarioId },
    });
    return raw ? this.toDomainSimple(raw) : null;
  }

  async listarTodos(): Promise<any[]> {
    const raws = await prisma.medico.findMany({
      include: {
        especialidad: true,
        horarios: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return raws.map((r: any) => this.toDomain(r));
  }

  async actualizar(medico: Medico): Promise<void> {
    await prisma.medico.update({
      where: { id: medico.id },
      data: {
        nombreUsuario: medico.nombreUsuario,
        especialidadId: medico.especialidadId,
        turno: medico.turno,
        activo: medico.activo,
      },
    });
  }

  async reemplazarHorarios(medicoId: string, horarios: HorarioMedico[]): Promise<void> {
    await prisma.$transaction(async (tx: any) => {
      await tx.horarioMedico.deleteMany({ where: { medicoId } });
      if (horarios.length > 0) {
        await tx.horarioMedico.createMany({
          data: horarios.map((h) => ({
            id: crypto.randomUUID(),
            medicoId,
            diaSemana: h.diaSemana,
            horaInicio: h.horaInicio,
            horaFin: h.horaFin,
            duracionSlot: h.duracionSlot,
          })),
        });
      }
    });
  }

  async eliminar(medicoId: string): Promise<void> {
    await prisma.medico.delete({ where: { id: medicoId } });
  }

  // ─── Mapeo Prisma → Dominio ───────────────────────────────────────────────
  private toDomain(raw: any): any {
    const medicoResult = Medico.create(raw.id, {
      usuarioId: raw.usuarioId,
      nombreUsuario: raw.nombreUsuario,
      especialidadId: raw.especialidadId,
      turno: raw.turno,
      activo: raw.activo,
    });

    if (medicoResult.isErr) {
      throw new Error('Error reconstruyendo Medico desde BD: ' + medicoResult.error.message);
    }

    const horarios = (raw.horarios || []).map((h: any) => {
      const hr = HorarioMedico.create({
        diaSemana: h.diaSemana,
        horaInicio: h.horaInicio,
        horaFin: h.horaFin,
        duracionSlot: h.duracionSlot,
      });
      if (hr.isErr) {
        throw new Error('Horario corrupto en BD: ' + hr.error.message);
      }
      return hr.value;
    });

    return {
      ...medicoResult.value,
      horarios,
      especialidadNombre: raw.especialidad?.nombre || 'Sin especialidad',
    };
  }

  private toDomainSimple(raw: any): Medico {
    const result = Medico.create(raw.id, {
      usuarioId: raw.usuarioId,
      nombreUsuario: raw.nombreUsuario,
      especialidadId: raw.especialidadId,
      turno: raw.turno,
      activo: raw.activo,
    });
    if (result.isErr) {
      throw new Error('Error reconstruyendo Medico: ' + result.error.message);
    }
    return result.value;
  }
}
