/**
 * ============================================================================
 * PrismaMedicoConsulta — Adaptador de consulta read-only de médicos
 * ============================================================================
 * Implementa IMedicoConsultaPort usando Prisma directamente.
 * ============================================================================
 */

import { prisma } from '@/shared/prisma-client';
import type {
  IMedicoConsultaPort,
  MedicoConsulta,
  HorarioConsulta,
  EspecialidadDTO,
} from '@/modules/citas/domain/ports/out/medico-consulta.port';

export class PrismaMedicoConsulta implements IMedicoConsultaPort {
  async buscarPorId(medicoId: string): Promise<MedicoConsulta | null> {
    const raw = await prisma.medico.findUnique({
      where: { id: medicoId },
      include: { especialidad: true },
    });
    if (!raw) return null;
    return {
      id: raw.id,
      nombreUsuario: raw.nombreUsuario,
      activo: raw.activo,
      especialidadNombre: raw.especialidad?.nombre ?? 'Sin especialidad',
      usuarioId: raw.usuarioId,
    };
  }

  async buscarPorIds(medicoIds: string[]): Promise<Map<string, MedicoConsulta>> {
    if (medicoIds.length === 0) return new Map();
    const raws = await prisma.medico.findMany({
      where: { id: { in: medicoIds } },
      include: { especialidad: true },
    });
    const map = new Map<string, MedicoConsulta>();
    for (const raw of raws) {
      map.set(raw.id, {
        id: raw.id,
        nombreUsuario: raw.nombreUsuario,
        activo: raw.activo,
        especialidadNombre: raw.especialidad?.nombre ?? 'Sin especialidad',
        usuarioId: raw.usuarioId,
      });
    }
    return map;
  }

  async buscarPorUsuarioId(usuarioId: string): Promise<MedicoConsulta | null> {
    const raw = await prisma.medico.findUnique({
      where: { usuarioId },
      include: { especialidad: true },
    });
    if (!raw) return null;
    return {
      id: raw.id,
      nombreUsuario: raw.nombreUsuario,
      activo: raw.activo,
      especialidadNombre: raw.especialidad?.nombre ?? 'Sin especialidad',
      usuarioId: raw.usuarioId,
    };
  }

  async buscarPorEspecialidadActiva(especialidadId: string): Promise<MedicoConsulta[]> {
    const raws = await prisma.medico.findMany({
      where: { especialidadId, activo: true },
      include: { especialidad: true },
    });
    return raws.map((raw: any) => ({
      id: raw.id,
      nombreUsuario: raw.nombreUsuario,
      activo: raw.activo,
      especialidadNombre: raw.especialidad?.nombre ?? 'Sin especialidad',
      usuarioId: raw.usuarioId,
    }));
  }

  async listarEspecialidades(): Promise<EspecialidadDTO[]> {
    const especialidades = await prisma.especialidad.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
    });
    return especialidades.map((e: any) => ({ id: e.id, nombre: e.nombre }));
  }

  async listarHorarios(medicoId: string, diaSemana: number): Promise<HorarioConsulta[]> {
    const raws = await prisma.horarioMedico.findMany({
      where: { medicoId, diaSemana },
      orderBy: { horaInicio: 'asc' },
    });
    return raws.map((raw: any) => ({
      horaInicio: raw.horaInicio,
      horaFin: raw.horaFin,
      duracionSlot: raw.duracionSlot,
    }));
  }

  async listarHorariosPorMedicos(
    medicoIds: string[],
    diasSemana: number[],
  ): Promise<Map<string, HorarioConsulta[]>> {
    if (medicoIds.length === 0 || diasSemana.length === 0) {
      return new Map();
    }
    const raws = await prisma.horarioMedico.findMany({
      where: {
        medicoId: { in: medicoIds },
        diaSemana: { in: diasSemana },
      },
      orderBy: { horaInicio: 'asc' },
    });

    const map = new Map<string, HorarioConsulta[]>();
    for (const raw of raws) {
      const key = `${raw.medicoId}#${raw.diaSemana}`;
      const horario: HorarioConsulta = {
        horaInicio: raw.horaInicio,
        horaFin: raw.horaFin,
        duracionSlot: raw.duracionSlot,
      };
      const existing = map.get(key);
      if (existing) {
        existing.push(horario);
      } else {
        map.set(key, [horario]);
      }
    }
    return map;
  }
}
