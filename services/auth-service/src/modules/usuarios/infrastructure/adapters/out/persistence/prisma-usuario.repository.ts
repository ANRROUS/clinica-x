/**
 * ============================================================================
 * PrismaUsuarioRepository — Adaptador de salida de persistencia
 * ============================================================================
 * Implementa IUsuarioRepository usando PrismaClient.
 * Mapea entre el modelo Prisma (datos planos) y la entidad de dominio (ricos).
 * ============================================================================
 */

import { prisma } from '@/shared/prisma-client';
import { Usuario } from '@/modules/usuarios/domain/entities/usuario.entity';
import { Dni } from '@/modules/usuarios/domain/value-objects/dni.vo';
import { Email } from '@/modules/usuarios/domain/value-objects/email.vo';
import type { IUsuarioRepository } from '@/modules/usuarios/domain/ports/out/usuario.repository.port';

export class PrismaUsuarioRepository implements IUsuarioRepository {
  async guardar(usuario: Usuario): Promise<void> {
    await prisma.usuario.create({
      data: {
        id: usuario.id,
        dni: usuario.dni.value,
        email: usuario.email.value,
        passwordHash: usuario.passwordHash,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        telefono: usuario.telefono,
        rol: usuario.rol,
      },
    });
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    const raw = await prisma.usuario.findUnique({ where: { id } });
    return raw ? this.toDomain(raw) : null;
  }

  async buscarPorIds(ids: string[]): Promise<Usuario[]> {
    if (ids.length === 0) return [];
    const raws = await prisma.usuario.findMany({
      where: { id: { in: ids } },
    });
    return raws.map((raw) => this.toDomain(raw));
  }

  async buscarPorDni(dni: string): Promise<Usuario | null> {
    const raw = await prisma.usuario.findUnique({ where: { dni } });
    return raw ? this.toDomain(raw) : null;
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const raw = await prisma.usuario.findUnique({ where: { email } });
    return raw ? this.toDomain(raw) : null;
  }

  async buscarPorDniYEmail(dni: string, email: string): Promise<Usuario | null> {
    const raw = await prisma.usuario.findFirst({
      where: { dni, email },
    });
    return raw ? this.toDomain(raw) : null;
  }

  async actualizar(usuario: Usuario): Promise<void> {
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        dni: usuario.dni.value,
        email: usuario.email.value,
        passwordHash: usuario.passwordHash,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        telefono: usuario.telefono,
        rol: usuario.rol,
      },
    });
  }

  private toDomain(raw: any): Usuario {
    const dniResult = Dni.create(raw.dni);
    const emailResult = Email.create(raw.email);
    if (dniResult.isErr || emailResult.isErr) {
      throw new Error('Datos corruptos en la base de datos: DNI o email inválido');
    }
    const usuarioResult = Usuario.create(raw.id, {
      dni: dniResult.value,
      email: emailResult.value,
      passwordHash: raw.passwordHash,
      nombre: raw.nombre,
      apellido: raw.apellido,
      telefono: raw.telefono ?? undefined,
      rol: raw.rol,
    });
    if (usuarioResult.isErr) {
      throw new Error('Error reconstruyendo entidad desde BD: ' + usuarioResult.error.message);
    }
    return usuarioResult.value;
  }
}
