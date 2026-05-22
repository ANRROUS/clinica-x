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
import type { LayerLogger } from '@/shared/layer-logger';

export interface CrearUsuarioConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
}

export class CrearUsuarioUseCase implements ICrearUsuarioPort {
  constructor(
    private readonly repo: IUsuarioRepository,
    private readonly hashService: IHashService,
    private readonly config: CrearUsuarioConfig,
    private readonly log?: LayerLogger,
  ) {}

  async execute(dto: CrearUsuarioDto): Promise<Result<SesionResponseDto, Error>> {
    this.log?.info('application', 'Caso de uso CrearUsuario iniciado');

    // ─── 1. Crear Value Objects ─────────────────────────────────────────────
    this.log?.debug('domain', 'Creando Value Objects');

    const dniResult = Dni.create(dto.dni);
    if (dniResult.isErr) {
      this.log?.warn('domain', 'DNI inválido', { error: { message: dniResult.error.message } });
      return Err(dniResult.error);
    }

    const emailResult = Email.create(dto.email);
    if (emailResult.isErr) {
      this.log?.warn('domain', 'Email inválido', { error: { message: emailResult.error.message } });
      return Err(emailResult.error);
    }

    const passwordResult = Password.create(dto.password);
    if (passwordResult.isErr) {
      this.log?.warn('domain', 'Password inválido', { error: { message: passwordResult.error.message } });
      return Err(passwordResult.error);
    }

    this.log?.debug('domain', 'Value Objects creados exitosamente');

    // ─── 2. Verificar unicidad ──────────────────────────────────────────────
    this.log?.debug('infrastructure', 'Verificando unicidad de DNI');
    const existenteDni = await this.repo.buscarPorDni(dniResult.value.value);
    if (existenteDni) {
      this.log?.warn('domain', 'DNI duplicado');
      return Err(new UsuarioDuplicadoError('DNI', dniResult.value.value));
    }

    this.log?.debug('infrastructure', 'Verificando unicidad de email');
    const existenteEmail = await this.repo.buscarPorEmail(emailResult.value.value);
    if (existenteEmail) {
      this.log?.warn('domain', 'Email duplicado');
      return Err(new UsuarioDuplicadoError('email', emailResult.value.value));
    }

    // ─── 3. Hashear contraseña ──────────────────────────────────────────────
    this.log?.debug('infrastructure', 'Hasheando contraseña');
    const passwordHash = await this.hashService.hash(passwordResult.value.value);

    // ─── 4. Crear entidad ───────────────────────────────────────────────────
    this.log?.debug('domain', 'Creando entidad Usuario');
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
    if (usuarioResult.isErr) {
      this.log?.error('domain', 'Error al crear entidad Usuario', usuarioResult.error);
      return Err(usuarioResult.error);
    }

    // ─── 5. Persistir ───────────────────────────────────────────────────────
    this.log?.debug('infrastructure', 'Persistiendo usuario en repositorio');
    await this.repo.guardar(usuarioResult.value);

    // ─── 6. Generar JWT y retornar ──────────────────────────────────────────
    this.log?.debug('application', 'Generando token JWT');
    const token = jwt.sign(
      {
        sub: usuarioResult.value.id,
        rol: usuarioResult.value.rol,
        email: usuarioResult.value.email.value,
      },
      this.config.jwtSecret,
      { expiresIn: this.config.jwtExpiresIn as any },
    );

    this.log?.info('application', 'Caso de uso CrearUsuario completado', {
      output: { userId: usuarioResult.value.id, tokenGenerated: true },
    });

    return Ok({
      token,
      usuario: toUsuarioResponseDto(usuarioResult.value),
    });
  }
}
