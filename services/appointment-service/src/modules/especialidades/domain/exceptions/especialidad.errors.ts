export class EspecialidadDuplicadaError extends Error {
  readonly httpStatus = 409;
  readonly codigo = 'ESPECIALIDAD_DUPLICADA';
  constructor(campo: string, valor: string) {
    super(`Ya existe una especialidad con ${campo}: ${valor}`);
    this.name = 'EspecialidadDuplicadaError';
  }
}

export class EspecialidadNoEncontradaError extends Error {
  readonly httpStatus = 404;
  readonly codigo = 'ESPECIALIDAD_NO_ENCONTRADA';
  constructor(id: string) {
    super(`Especialidad no encontrada con ID: ${id}`);
    this.name = 'EspecialidadNoEncontradaError';
  }
}