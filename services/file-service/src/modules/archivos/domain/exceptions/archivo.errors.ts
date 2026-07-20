/**
 * ============================================================================
 * Excepciones del dominio de archivos
 * ============================================================================
 */

import { ErrorDominio } from '@clinica-x/shared-kernel';

export class ArchivoNoEncontradoError extends ErrorDominio {
  readonly codigo = 'ARCHIVO_NO_ENCONTRADO';
  readonly httpStatus = 404;

  constructor(id?: string) {
    super(id ? `Archivo con id '${id}' no encontrado` : 'Archivo no encontrado');
  }
}

export class TipoMimeNoPermitidoError extends ErrorDominio {
  readonly codigo = 'TIPO_MIME_NO_PERMITIDO';
  readonly httpStatus = 400;

  constructor(tipo: string) {
    super(`El tipo de archivo "${tipo}" no está permitido`);
  }
}

export class TamanoArchivoExcedidoError extends ErrorDominio {
  readonly codigo = 'TAMANO_ARCHIVO_EXCEDIDO';
  readonly httpStatus = 413;

  constructor(maxBytes: number) {
    super(`El archivo excede el tamaño máximo permitido de ${maxBytes} bytes`);
  }
}
