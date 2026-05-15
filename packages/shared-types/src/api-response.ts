/**
 * Forma estandarizada de las respuestas HTTP de todos los servicios.
 *   { success: true, data: ... }   →  caso exitoso
 *   { success: false, error: ... } →  caso de error
 */

export interface ApiResponseExito<T> {
  success: true;
  data: T;
}

export interface ApiResponseErrorDetalle {
  campo: string;
  mensaje: string;
}

export interface ApiResponseError {
  success: false;
  error: {
    codigo: string;
    mensaje: string;
    detalles?: ApiResponseErrorDetalle[];
  };
}

export type ApiResponse<T> = ApiResponseExito<T> | ApiResponseError;
