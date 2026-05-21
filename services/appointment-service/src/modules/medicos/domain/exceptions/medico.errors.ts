/**
 * ============================================================================
 * Excepciones del dominio de médicos
 * ============================================================================
 */

import { ErrorDominio } from '@clinica-x/shared-kernel';

export class MedicoDuplicadoError extends ErrorDominio {
  readonly codigo = 'MEDICO_DUPLICADO';
  readonly httpStatus = 409;

  constructor(campo: string, valor: string) {
    super(`Ya existe un médico con ${campo}='${valor}'`);
  }
}

export class MedicoNoEncontradoError extends ErrorDominio {
  readonly codigo = 'MEDICO_NO_ENCONTRADO';
  readonly httpStatus = 404;

  constructor(id?: string) {
    super(id ? `Médico con id '${id}' no encontrado` : 'Médico no encontrado');
  }
}

export class EspecialidadNoEncontradaError extends ErrorDominio {
  readonly codigo = 'ESPECIALIDAD_NO_ENCONTRADA';
  readonly httpStatus = 404;

  constructor(id: string) {
    super(`Especialidad con id '${id}' no encontrada`);
  }
}

export class ErrorAuthService extends ErrorDominio {
  readonly codigo = 'AUTH_SERVICE_ERROR';
  readonly httpStatus = 502;

  constructor(mensaje: string) {
    super(`Error comunicándose con auth-service: ${mensaje}`);
  }
}

export class DatosDuplicadosError extends ErrorDominio {
  readonly codigo = 'DATOS_DUPLICADOS';
  readonly httpStatus = 409;

  constructor() {
    super('Los datos proporcionados ya están en uso. Verifique el DNI, correo o nombre de usuario e intente nuevamente.');
  }
}
