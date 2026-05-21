/**
 * ============================================================================
 * Caso de uso: ActualizarMedico
 * ============================================================================
 * Orquesta:
 *  1. Buscar médico por id
 *  2. Validar que nombreUsuario no esté en uso por otro médico
 *  3. Llamar a auth-service para actualizar datos personales
 *  4. Actualizar entidad Medico
 *  5. Reemplazar horarios si vienen nuevos
 *  6. Persistir cambios
 * ============================================================================
 */

import { Result, Ok, Err } from '@clinica-x/shared-kernel';
import { Medico } from '@/modules/medicos/domain/entities/medico.entity';
import { HorarioMedico } from '@/modules/medicos/domain/value-objects/horario-medico.vo';
import {
  MedicoNoEncontradoError,
  MedicoDuplicadoError,
  ErrorAuthService,
  DatosDuplicadosError,
} from '@/modules/medicos/domain/exceptions/medico.errors';
import type {
  IActualizarMedicoPort,
  ActualizarMedicoDto,
  MedicoResponseDto,
} from '@/modules/medicos/domain/ports/in/medicos.port';
import type { IMedicoRepository, IAuthServiceClient } from '@/modules/medicos/domain/ports/out/medico.repository.port';
import { toMedicoResponseDto } from '@/modules/medicos/application/mapper';

export class ActualizarMedicoUseCase implements IActualizarMedicoPort {
  constructor(
    private readonly repo: IMedicoRepository,
    private readonly authClient: IAuthServiceClient,
  ) {}

  async execute(medicoId: string, dto: ActualizarMedicoDto): Promise<Result<MedicoResponseDto, Error>> {
    // 1. Buscar médico
    const medicoRaw = await this.repo.buscarPorId(medicoId);
    if (!medicoRaw) {
      return Err(new MedicoNoEncontradoError(medicoId));
    }

    // Extraemos los datos del raw (el repo retorna Medico + horarios + especialidadNombre)
    const { medico: medicoBase, horarios: horariosActuales, especialidadNombre } = medicoRaw;

    // 2. Verificar nombreUsuario único
    if (dto.username && dto.username !== medicoBase.nombreUsuario) {
      const existente = await this.repo.buscarPorNombreUsuario(dto.username);
      if (existente) {
        return Err(new MedicoDuplicadoError('nombreUsuario', dto.username));
      }
    }

    // 3. Actualizar usuario en auth-service
    try {
      await this.authClient.actualizarUsuario(medicoBase.usuarioId, {
        nombre: dto.nombre,
        apellido: dto.apellido,
        dni: dto.dni,
        email: dto.email,
        telefono: dto.telefono,
        password: dto.password,
      });
    } catch (err: any) {
      if (err.status === 409 && err.code === 'USUARIO_DUPLICADO') {
        return Err(new DatosDuplicadosError());
      }
      return Err(new ErrorAuthService('Ocurrió un error al actualizar el usuario. Intente nuevamente más tarde.'));
    }

    // 4. Actualizar entidad Medico local
    medicoBase.actualizarDatos({
      especialidadId: dto.specialtyId,
      turno: dto.shift,
      nombreUsuario: dto.username,
    });
    await this.repo.actualizar(medicoBase);

    // 5. Reemplazar horarios si vienen nuevos
    let horariosFinales = horariosActuales;
    if (dto.schedules && dto.schedules.length > 0) {
      const nuevosHorarios: HorarioMedico[] = [];
      for (const s of dto.schedules) {
        const h = HorarioMedico.create({
          diaSemana: s.diaSemana as any,
          horaInicio: s.horaInicio,
          horaFin: s.horaFin,
        });
        if (h.isErr) return Err(h.error);
        nuevosHorarios.push(h.value);
      }
      await this.repo.reemplazarHorarios(medicoId, nuevosHorarios);
      horariosFinales = nuevosHorarios;
    }

    // 6. Retornar DTO
    return Ok(
      toMedicoResponseDto(
        medicoBase,
        horariosFinales,
        dto.specialtyId ?? medicoBase.especialidadId,
        {
          nombre: dto.nombre ?? '—',
          apellido: dto.apellido ?? '—',
          dni: dto.dni ?? '—',
          email: dto.email ?? '—',
          telefono: dto.telefono,
        },
      ),
    );
  }
}
