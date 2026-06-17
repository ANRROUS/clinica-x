/**
 * ============================================================================
 * Caso de uso: ObtenerMedico
 * ============================================================================
 */

import { Result, Ok, Err } from '@clinica-x/shared-kernel';
import { MedicoNoEncontradoError } from '@/modules/medicos/domain/exceptions/medico.errors';
import type { IObtenerMedicoPort, MedicoResponseDto } from '@/modules/medicos/domain/ports/in/medicos.port';
import type { IAuthServiceClient, IMedicoRepository } from '@/modules/medicos/domain/ports/out/medico.repository.port';
import { toMedicoResponseDto } from '@/modules/medicos/application/mapper';
import { logger } from '@/shared/logger';

export class ObtenerMedicoUseCase implements IObtenerMedicoPort {
  constructor(
    private readonly repo: IMedicoRepository,
    private readonly authClient: IAuthServiceClient,
  ) {}

  async execute(medicoId: string): Promise<Result<MedicoResponseDto, Error>> {
    const medicoRaw = await this.repo.buscarPorId(medicoId);
    if (!medicoRaw) {
      return Err(new MedicoNoEncontradoError(medicoId));
    }

    const { medico, horarios, especialidadNombre } = medicoRaw;

    let datosPersonales: {
      nombre: string;
      apellido: string;
      dni: string;
      email: string;
      telefono?: string;
    } = {
      nombre: '—',
      apellido: '—',
      dni: '—',
      email: '—',
    };

    try {
      const usuarios = await this.authClient.obtenerUsuariosPorIds([medico.usuarioId]);
      const usuario = usuarios[0];
      if (usuario) {
        datosPersonales = {
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          dni: usuario.dni,
          email: usuario.email,
          telefono: usuario.telefono,
        };
      }
    } catch (err) {
      logger.error({ err, medicoId, usuarioId: medico.usuarioId }, 'Error al obtener datos del usuario desde auth-service. Se usarán valores por defecto.');
    }

    return Ok(
      toMedicoResponseDto(
        medico,
        horarios,
        especialidadNombre,
        datosPersonales,
      ),
    );
  }
}
