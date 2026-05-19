import { prisma } from '@/shared/prisma-client';
import type { IEspecialidadRepository } from '@/modules/especialidades/domain/ports/out/especialidad.repository.port';
import type { EspecialidadDTO } from '@/modules/especialidades/domain/ports/in/especialidades.port';

export class PrismaEspecialidadRepository implements IEspecialidadRepository {
  async listar(): Promise<EspecialidadDTO[]> {
    const especialidades = await prisma.especialidad.findMany({
      orderBy: { nombre: 'asc' },
    });
    return especialidades.map((e: any) => ({
      id: e.id,
      nombre: e.nombre,
      activo: e.activo,
    }));
  }

  async buscarPorId(id: string): Promise<EspecialidadDTO | null> {
    const e = await prisma.especialidad.findUnique({ where: { id } });
    if (!e) return null;
    return { id: e.id, nombre: e.nombre, activo: e.activo };
  }

  async buscarPorNombre(nombre: string): Promise<EspecialidadDTO | null> {
    const e = await prisma.especialidad.findFirst({ where: { nombre } });
    if (!e) return null;
    return { id: e.id, nombre: e.nombre, activo: e.activo };
  }

  async crear(nombre: string): Promise<EspecialidadDTO> {
    const e = await prisma.especialidad.create({ data: { nombre } });
    return { id: e.id, nombre: e.nombre, activo: e.activo };
  }

  async actualizar(id: string, dto: { nombre?: string }): Promise<EspecialidadDTO> {
    const e = await prisma.especialidad.update({
      where: { id },
      data: dto,
    });
    return { id: e.id, nombre: e.nombre, activo: e.activo };
  }

  async cambiarEstado(id: string, activo: boolean): Promise<EspecialidadDTO> {
    const e = await prisma.especialidad.update({
      where: { id },
      data: { activo },
    });
    return { id: e.id, nombre: e.nombre, activo: e.activo };
  }
}