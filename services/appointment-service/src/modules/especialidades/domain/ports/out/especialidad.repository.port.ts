import type { EspecialidadDTO } from '../in/especialidades.port';

export interface IEspecialidadRepository {
  listar(): Promise<EspecialidadDTO[]>;
  buscarPorId(id: string): Promise<EspecialidadDTO | null>;
  buscarPorNombre(nombre: string): Promise<EspecialidadDTO | null>;
  crear(nombre: string): Promise<EspecialidadDTO>;
  actualizar(id: string, dto: { nombre?: string }): Promise<EspecialidadDTO>;
  cambiarEstado(id: string, activo: boolean): Promise<EspecialidadDTO>;
}