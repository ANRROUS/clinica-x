import type { Result } from '@clinica-x/shared-kernel';

export interface EspecialidadDTO {
  id: string;
  nombre: string;
  activo: boolean;
}

export interface CrearEspecialidadDto {
  nombre: string;
}

export interface ActualizarEspecialidadDto {
  nombre?: string;
}

export interface CambiarEstadoEspecialidadDto {
  activo: boolean;
}

export interface IListarEspecialidadesPort {
  execute(): Promise<Result<EspecialidadDTO[], Error>>;
}

export interface ICrearEspecialidadPort {
  execute(dto: CrearEspecialidadDto): Promise<Result<EspecialidadDTO, Error>>;
}

export interface IActualizarEspecialidadPort {
  execute(id: string, dto: ActualizarEspecialidadDto): Promise<Result<EspecialidadDTO, Error>>;
}

export interface ICambiarEstadoEspecialidadPort {
  execute(id: string, dto: CambiarEstadoEspecialidadDto): Promise<Result<EspecialidadDTO, Error>>;
}