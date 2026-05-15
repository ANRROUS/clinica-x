/**
 * ============================================================================
 * Caso de uso: CrearMedico
 * ============================================================================
 * Orquesta:
 *  1. Validar que la especialidad exista
 *  2. Verificar que el nombreUsuario no esté en uso
 *  3. Llamar a auth-service para crear el usuario con rol MEDICO
 *  4. Crear entidad Medico en appointment-service
 *  5. Persistir médico y horarios
 *  6. Retornar DTO de respuesta
 * ============================================================================
 */

import { Result, Ok, Err } from '@clinica-x/shared-kernel';
import { Medico } from '@/modules/medicos/domain/entities/medico.entity';
import { HorarioMedico } from '@/modules/medicos/domain/value-objects/horario-medico.vo';
import {
  MedicoDuplicadoError,
  ErrorAuthService,
} from '@/modules/medicos/domain/exceptions/medico.errors';
import type {
  ICrearMedicoPort,
  CrearMedicoDto,
  MedicoResponseDto,
} from '@/modules/medicos/domain/ports/in/medicos.port';
import type { IMedicoRepository, IAuthServiceClient } from '@/modules/medicos/domain/ports/out/medico.repository.port';
import { toMedicoResponseDto } from '@/modules/medicos/application/mapper';

export class CrearMedicoUseCase implements ICrearMedicoPort {
  constructor(
    private readonly repo: IMedicoRepository,
    private readonly authClient: IAuthServiceClient,
  ) {}

  async execute(dto: CrearMedicoDto): Promise<Result<MedicoResponseDto, Error>> {
    // 1. Verificar que nombreUsuario no esté en uso
    const existente = await this.repo.buscarPorNombreUsuario(dto.username);
    if (existente) {
      return Err(new MedicoDuplicadoError('nombreUsuario', dto.username));
    }

    // 2. Crear usuario en auth-service
    let usuarioCreado: { id: string };
    try {
      usuarioCreado = await this.authClient.crearUsuarioMedico({
        dni: dto.dni,
        email: dto.email,
        password: dto.password,
        nombre: dto.nombre,
        apellido: dto.apellido,
        telefono: dto.telefono,
      });
    } catch (err: any) {
      return Err(new ErrorAuthService(err.message || 'No se pudo crear el usuario'));
    }

    // 3. Crear entidad Medico
    const id = crypto.randomUUID();
    const medicoResult = Medico.create(id, {
      usuarioId: usuarioCreado.id,
      nombreUsuario: dto.username,
      especialidadId: dto.specialtyId,
      turno: dto.shift,
      activo: true,
    });
    if (medicoResult.isErr) return Err(medicoResult.error);

    const medico = medicoResult.value;

    // 4. Crear horarios
    const horariosResult = this.crearHorarios(dto.schedules);
    if (horariosResult.isErr) return Err(horariosResult.error);

    // 5. Persistir
    await this.repo.guardar(medico);
    await this.repo.reemplazarHorarios(medico.id, horariosResult.value);

    // 6. Retornar DTO
    return Ok(
      toMedicoResponseDto(
        medico,
        horariosResult.value,
        dto.specialtyId, // Se sobreescribe con nombre real en controller
        {
          nombre: dto.nombre,
          apellido: dto.apellido,
          dni: dto.dni,
          email: dto.email,
          telefono: dto.telefono,
        },
      ),
    );
  }

  private crearHorarios(dtos: { diaSemana: number; horaInicio: string; horaFin: string }[]): Result<HorarioMedico[], Error> {
    const horarios: HorarioMedico[] = [];
    for (const dto of dtos) {
      const h = HorarioMedico.create({
        diaSemana: dto.diaSemana as any,
        horaInicio: dto.horaInicio,
        horaFin: dto.horaFin,
      });
      if (h.isErr) return Err(h.error);
      horarios.push(h.value);
    }
    return Ok(horarios);
  }
}
