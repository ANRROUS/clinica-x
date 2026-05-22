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
import type { LayerLogger } from '@/shared/layer-logger';

export interface IniciarSesionConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
}

export class IniciarSesionUseCase implements IIniciarSesionPort {
  constructor(
    private readonly repo: IUsuarioRepository,
    private readonly hashService: IHashService,
    private readonly config: IniciarSesionConfig,
    private readonly log?: LayerLogger,
  ) {}

  async execute(dto: IniciarSesionDto): Promise<Result<SesionResponseDto, Error>> {
    this.log?.info('application', 'Caso de uso IniciarSesion iniciado');

    // ─── 1. Buscar usuario por email (y opcionalmente por DNI) ───────────────
    const emailNormalizado = dto.email.trim().toLowerCase();
    this.log?.debug('application', 'Email normalizado', { input: { email: emailNormalizado } });

    let usuario: any;

    if (dto.dni) {
      this.log?.debug('infrastructure', 'Buscando usuario por DNI + email');
      usuario = await this.repo.buscarPorDniYEmail(dto.dni.trim(), emailNormalizado);
    } else {
      this.log?.debug('infrastructure', 'Buscando usuario por email');
      usuario = await this.repo.buscarPorEmail(emailNormalizado);
    }

    if (!usuario) {
      this.log?.warn('domain', 'Usuario no encontrado');
      return Err(new CredencialesInvalidasError());
    }

    this.log?.debug('domain', 'Usuario encontrado', { output: { userId: usuario.id } });

    // ─── 2. Verificar contraseña ────────────────────────────────────────────
    this.log?.debug('infrastructure', 'Verificando contraseña');
    const passwordValida = await this.hashService.comparar(dto.password, usuario.passwordHash);
    if (!passwordValida) {
      this.log?.warn('domain', 'Contraseña inválida');
      return Err(new CredencialesInvalidasError());
    }

    // ─── 3. Generar JWT ─────────────────────────────────────────────────────
    this.log?.debug('application', 'Generando token JWT');
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
    this.log?.info('application', 'Caso de uso IniciarSesion completado', {
      output: { userId: usuario.id, tokenGenerated: true },
    });

    return Ok({
      token,
      usuario: toUsuarioResponseDto(usuario),
    });
  }
}
