/**
 * ============================================================================
 * Caso de uso: IniciarSesion
 * ============================================================================
 * Orquesta:
 *  1. Buscar usuario por DNI + email
 *  2. Verificar contraseña con hashService
 *  3. Generar JWT
 *  4. Retornar token + datos del usuario
 * ============================================================================
 */

import jwt from 'jsonwebtoken';
import { Result, Ok, Err } from '@clinica-x/shared-kernel';
import { CredencialesInvalidasError } from '../../../domain/exceptions/usuario.errors';
import type {
  IIniciarSesionPort,
  IniciarSesionDto,
  SesionResponseDto,
} from '../../../domain/ports/in/usuarios.port';
import type { IUsuarioRepository, IHashService } from '../../../domain/ports/out/usuario.repository.port';
import { toUsuarioResponseDto } from '../../mapper';

export interface IniciarSesionConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
}

export class IniciarSesionUseCase implements IIniciarSesionPort {
  constructor(
    private readonly repo: IUsuarioRepository,
    private readonly hashService: IHashService,
    private readonly config: IniciarSesionConfig,
  ) {}

  async execute(dto: IniciarSesionDto): Promise<Result<SesionResponseDto, Error>> {
    // ─── 1. Buscar usuario por email (y opcionalmente por DNI) ───────────────
    const emailNormalizado = dto.email.trim().toLowerCase();
    let usuario: any;

    if (dto.dni) {
      usuario = await this.repo.buscarPorDniYEmail(dto.dni.trim(), emailNormalizado);
    } else {
      usuario = await this.repo.buscarPorEmail(emailNormalizado);
    }

    if (!usuario) {
      return Err(new CredencialesInvalidasError());
    }

    // ─── 2. Verificar contraseña ────────────────────────────────────────────
    const passwordValida = await this.hashService.comparar(dto.password, usuario.passwordHash);
    if (!passwordValida) {
      return Err(new CredencialesInvalidasError());
    }

    // ─── 3. Generar JWT ─────────────────────────────────────────────────────
    const token = jwt.sign(
      {
        sub: usuario.id,
        rol: usuario.rol,
        email: usuario.email.value,
      },
      this.config.jwtSecret,
      { expiresIn: this.config.jwtExpiresIn as any },
    );

    // ─── 4. Retornar ────────────────────────────────────────────────────────
    return Ok({
      token,
      usuario: toUsuarioResponseDto(usuario),
    });
  }
}
