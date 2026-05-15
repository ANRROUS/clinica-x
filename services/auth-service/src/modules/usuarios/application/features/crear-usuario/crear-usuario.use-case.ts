/**
 * ============================================================================
 * Caso de uso: CrearUsuario (registro de paciente)
 * ============================================================================
 * Orquesta:
 *  1. Validar VOs (Dni, Email, Password)
 *  2. Verificar que DNI y email no existan
 *  3. Hashear contraseña
 *  4. Crear entidad Usuario
 *  5. Persistir en repositorio
 *  6. Retornar DTO de respuesta
 * ============================================================================
 */

import jwt from 'jsonwebtoken';
import { Result, Ok, Err } from '@clinica-x/shared-kernel';
import { Dni } from '../../../domain/value-objects/dni.vo';
import { Email } from '../../../domain/value-objects/email.vo';
import { Password } from '../../../domain/value-objects/password.vo';
import { Usuario } from '../../../domain/entities/usuario.entity';
import {
  UsuarioDuplicadoError,
} from '../../../domain/exceptions/usuario.errors';
import type {
  ICrearUsuarioPort,
  CrearUsuarioDto,
  SesionResponseDto,
} from '../../../domain/ports/in/usuarios.port';
import type { IUsuarioRepository, IHashService } from '../../../domain/ports/out/usuario.repository.port';
import { toUsuarioResponseDto } from '../../mapper';

export interface CrearUsuarioConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
}

export class CrearUsuarioUseCase implements ICrearUsuarioPort {
  constructor(
    private readonly repo: IUsuarioRepository,
    private readonly hashService: IHashService,
    private readonly config: CrearUsuarioConfig,
  ) {}

  async execute(dto: CrearUsuarioDto): Promise<Result<SesionResponseDto, Error>> {
    // ─── 1. Crear Value Objects ─────────────────────────────────────────────
    const dniResult = Dni.create(dto.dni);
    if (dniResult.isErr) return Err(dniResult.error);

    const emailResult = Email.create(dto.email);
    if (emailResult.isErr) return Err(emailResult.error);

    const passwordResult = Password.create(dto.password);
    if (passwordResult.isErr) return Err(passwordResult.error);

    // ─── 2. Verificar unicidad ──────────────────────────────────────────────
    const existenteDni = await this.repo.buscarPorDni(dniResult.value.value);
    if (existenteDni) {
      return Err(new UsuarioDuplicadoError('DNI', dniResult.value.value));
    }

    const existenteEmail = await this.repo.buscarPorEmail(emailResult.value.value);
    if (existenteEmail) {
      return Err(new UsuarioDuplicadoError('email', emailResult.value.value));
    }

    // ─── 3. Hashear contraseña ──────────────────────────────────────────────
    const passwordHash = await this.hashService.hash(passwordResult.value.value);

    // ─── 4. Crear entidad ───────────────────────────────────────────────────
    const id = crypto.randomUUID();
    const usuarioResult = Usuario.create(id, {
      dni: dniResult.value,
      email: emailResult.value,
      passwordHash,
      nombre: dto.nombre.trim(),
      apellido: dto.apellido.trim(),
      telefono: dto.telefono?.trim() || undefined,
      rol: dto.rol || 'PACIENTE',
    });
    if (usuarioResult.isErr) return Err(usuarioResult.error);

    // ─── 5. Persistir ───────────────────────────────────────────────────────
    await this.repo.guardar(usuarioResult.value);

    // ─── 6. Generar JWT y retornar ──────────────────────────────────────────
    const token = jwt.sign(
      {
        sub: usuarioResult.value.id,
        rol: usuarioResult.value.rol,
        email: usuarioResult.value.email.value,
      },
      this.config.jwtSecret,
      { expiresIn: this.config.jwtExpiresIn as any },
    );

    return Ok({
      token,
      usuario: toUsuarioResponseDto(usuarioResult.value),
    });
  }
}
