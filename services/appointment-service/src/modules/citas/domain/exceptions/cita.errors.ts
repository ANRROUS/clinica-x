/**
 * ============================================================================
 * Excepciones del dominio de citas
 * ============================================================================
 */

import { ErrorDominio } from '@clinica-x/shared-kernel';

export class CitaNoEncontradaError extends ErrorDominio {
  readonly codigo = 'CITA_NO_ENCONTRADA';
  readonly httpStatus = 404;

  constructor(id?: string) {
    super(id ? `Cita con id '${id}' no encontrada` : 'Cita no encontrada');
  }
}

export class SlotNoDisponibleError extends ErrorDominio {
  readonly codigo = 'SLOT_NO_DISPONIBLE';
  readonly httpStatus = 409;

  constructor(mensaje?: string) {
    super(mensaje ?? 'El horario seleccionado ya no está disponible');
  }
}

export class CitaYaCanceladaError extends ErrorDominio {
  readonly codigo = 'CITA_YA_CANCELADA';
  readonly httpStatus = 409;

  constructor() {
    super('La cita ya está cancelada');
  }
}

export class NoSePuedeCancelarError extends ErrorDominio {
  readonly codigo = 'NO_SE_PUEDE_CANCELAR';
  readonly httpStatus = 403;

  constructor() {
    super('No puedes cancelar esta cita porque falta menos de 1 hora para la consulta');
  }
}

export class NoSePuedeReprogramarError extends ErrorDominio {
  readonly codigo = 'NO_SE_PUEDE_REPROGRAMAR';
  readonly httpStatus = 403;

  constructor() {
    super('No puedes reprogramar esta cita porque falta menos de 1 hora para la consulta');
  }
}

export class PacienteNoAutorizadoError extends ErrorDominio {
  readonly codigo = 'PACIENTE_NO_AUTORIZADO';
  readonly httpStatus = 403;

  constructor() {
    super('No tienes permiso para modificar esta cita');
  }
}

export class MedicoNoEncontradoError extends ErrorDominio {
  readonly codigo = 'MEDICO_NO_ENCONTRADO';
  readonly httpStatus = 404;

  constructor(id?: string) {
    super(id ? `Médico con id '${id}' no encontrado` : 'Médico no encontrado');
  }
}

export class MedicoInactivoError extends ErrorDominio {
  readonly codigo = 'MEDICO_INACTIVO';
  readonly httpStatus = 400;

  constructor() {
    super('El médico seleccionado no está activo');
  }
}
