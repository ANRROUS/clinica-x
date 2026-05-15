/**
 * ============================================================================
 * Excepciones del dominio de consultas
 * ============================================================================
 */

import { ErrorDominio } from '@clinica-x/shared-kernel';

export class ConsultaNoEncontradaError extends ErrorDominio {
  readonly codigo = 'CONSULTA_NO_ENCONTRADA';
  readonly httpStatus = 404;

  constructor(id?: string) {
    super(id ? `Consulta con id '${id}' no encontrada` : 'Consulta no encontrada');
  }
}

export class ConsultaYaFinalizadaError extends ErrorDominio {
  readonly codigo = 'CONSULTA_YA_FINALIZADA';
  readonly httpStatus = 400;

  constructor() {
    super('La consulta ya está finalizada');
  }
}

export class ConsultaActivaExistenteError extends ErrorDominio {
  readonly codigo = 'CONSULTA_ACTIVA_EXISTENTE';
  readonly httpStatus = 409;

  constructor() {
    super('Ya existe una consulta activa para este paciente y médico');
  }
}

export class PacienteNoAutorizadoError extends ErrorDominio {
  readonly codigo = 'PACIENTE_NO_AUTORIZADO';
  readonly httpStatus = 403;

  constructor() {
    super('No tiene permiso para acceder a esta consulta');
  }
}

export class MedicoNoAutorizadoError extends ErrorDominio {
  readonly codigo = 'MEDICO_NO_AUTORIZADO';
  readonly httpStatus = 403;

  constructor() {
    super('No tiene permiso para acceder a esta consulta');
  }
}
