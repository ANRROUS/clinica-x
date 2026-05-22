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
import { logger } from '@/shared/logger';

export class PrismaUsuarioRepository implements IUsuarioRepository {
  async guardar(usuario: Usuario): Promise<void> {
    const start = Date.now();
    logger.debug({ layer: 'infrastructure', action: 'guardarUsuario', msg: 'Ejecutando query: guardar usuario' });

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

    logger.debug({ layer: 'infrastructure', action: 'guardarUsuario', durationMs: Date.now() - start, msg: 'Query completada' });
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    const start = Date.now();
    logger.debug({ layer: 'infrastructure', action: 'buscarPorId', msg: 'Ejecutando query: buscarPorId' });

    const raw = await prisma.usuario.findUnique({ where: { id } });

    logger.debug({
      layer: 'infrastructure',
      action: 'buscarPorId',
      durationMs: Date.now() - start,
      output: { found: !!raw },
      msg: 'Query completada',
    });

    return raw ? this.toDomain(raw) : null;
  }

  async buscarPorIds(ids: string[]): Promise<Usuario[]> {
    const start = Date.now();
    logger.debug({ layer: 'infrastructure', action: 'buscarPorIds', input: { count: ids.length }, msg: 'Ejecutando query: buscarPorIds' });

    if (ids.length === 0) return [];
    const raws = await prisma.usuario.findMany({
      where: { id: { in: ids } },
    });

    logger.debug({
      layer: 'infrastructure',
      action: 'buscarPorIds',
      durationMs: Date.now() - start,
      output: { count: raws.length },
      msg: 'Query completada',
    });

    return raws.map((raw) => this.toDomain(raw));
  }

  async buscarPorDni(dni: string): Promise<Usuario | null> {
    const start = Date.now();
    logger.debug({ layer: 'infrastructure', action: 'buscarPorDni', msg: 'Ejecutando query: buscarPorDni' });

    const raw = await prisma.usuario.findUnique({ where: { dni } });

    logger.debug({
      layer: 'infrastructure',
      action: 'buscarPorDni',
      durationMs: Date.now() - start,
      output: { found: !!raw },
      msg: 'Query completada',
    });

    return raw ? this.toDomain(raw) : null;
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const start = Date.now();
    logger.debug({ layer: 'infrastructure', action: 'buscarPorEmail', msg: 'Ejecutando query: buscarPorEmail' });

    const raw = await prisma.usuario.findUnique({ where: { email } });

    logger.debug({
      layer: 'infrastructure',
      action: 'buscarPorEmail',
      durationMs: Date.now() - start,
      output: { found: !!raw },
      msg: 'Query completada',
    });

    return raw ? this.toDomain(raw) : null;
  }

  async buscarPorDniYEmail(dni: string, email: string): Promise<Usuario | null> {
    const start = Date.now();
    logger.debug({ layer: 'infrastructure', action: 'buscarPorDniYEmail', msg: 'Ejecutando query: buscarPorDniYEmail' });

    const raw = await prisma.usuario.findFirst({
      where: { dni, email },
    });

    logger.debug({
      layer: 'infrastructure',
      action: 'buscarPorDniYEmail',
      durationMs: Date.now() - start,
      output: { found: !!raw },
      msg: 'Query completada',
    });

    return raw ? this.toDomain(raw) : null;
  }

  async actualizar(usuario: Usuario): Promise<void> {
    const start = Date.now();
    logger.debug({ layer: 'infrastructure', action: 'actualizarUsuario', msg: 'Ejecutando query: actualizar usuario' });

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

    logger.debug({ layer: 'infrastructure', action: 'actualizarUsuario', durationMs: Date.now() - start, msg: 'Query completada' });
  }

  async buscarPorResetToken(resetToken: string): Promise<Usuario | null> {
    const start = Date.now();
    logger.debug({ layer: 'infrastructure', action: 'buscarPorResetToken', msg: 'Ejecutando query: buscarPorResetToken' });

    const raw = await prisma.usuario.findFirst({
      where: {
        resetToken,
        resetTokenExpira: { gt: new Date() },
      },
    });

    logger.debug({
      layer: 'infrastructure',
      action: 'buscarPorResetToken',
      durationMs: Date.now() - start,
      output: { found: !!raw },
      msg: 'Query completada',
    });

    return raw ? this.toDomain(raw) : null;
  }

  async guardarResetToken(usuarioId: string, resetToken: string, resetTokenExpira: Date): Promise<void> {
    const start = Date.now();
    logger.debug({ layer: 'infrastructure', action: 'guardarResetToken', msg: 'Ejecutando query: guardarResetToken' });

    await prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        resetToken,
        resetTokenExpira,
      },
    });

    logger.debug({ layer: 'infrastructure', action: 'guardarResetToken', durationMs: Date.now() - start, msg: 'Query completada' });
  }

  async actualizarContrasenaYLimpiarToken(usuarioId: string, nuevoHash: string): Promise<void> {
    const start = Date.now();
    logger.debug({ layer: 'infrastructure', action: 'actualizarContrasenaYLimpiarToken', msg: 'Ejecutando query: actualizarContrasenaYLimpiarToken' });

    await prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        passwordHash: nuevoHash,
        resetToken: null,
        resetTokenExpira: null,
      },
    });

    logger.debug({ layer: 'infrastructure', action: 'actualizarContrasenaYLimpiarToken', durationMs: Date.now() - start, msg: 'Query completada' });
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
