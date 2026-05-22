import type { TipoAnalisis, EstadoOcr } from './estados';

export interface AnalisisItemDTO {
  id: string;
  nombre: string;
  valor: string;
  unidad?: string;
  rangoMin?: string;
  rangoMax?: string;
  rangoReferencia?: string;
  estado?: string;
  nota?: string;
  orden: number;
}

export interface AnalisisGrupoDTO {
  id: string;
  nombreGrupo: string;
  orden: number;
  items: AnalisisItemDTO[];
}

export interface AnalisisResultadoDTO {
  id: string;
  ordenAnalisisId?: string;
  pacienteId: string;
  archivoId: string;
  consultaId?: string;
  tipoAnalisis: TipoAnalisis;
  resultadoIdOriginal?: string;
  laboratorio?: string;
  medicoSolicitante?: string;
  fechaToma?: string;
  horaToma?: string;
  fechaResultado?: string;
  datosMuestra?: Record<string, unknown>;
  pacienteNombreOcr?: string;
  pacienteIdOcr?: string;
  pacienteSexo?: string;
  pacienteEdad?: number;
  estadoOcr: EstadoOcr;
  errorOcr?: string;
  grupos: AnalisisGrupoDTO[];
  creadoEn: string;
}

export interface ProcesarOcrInput {
  archivoId: string;
  ordenAnalisisId: string;
  pacienteId: string;
  tipoAnalisis: TipoAnalisis;
}
