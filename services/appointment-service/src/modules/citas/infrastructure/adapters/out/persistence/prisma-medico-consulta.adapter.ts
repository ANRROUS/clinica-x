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
    };
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
}
