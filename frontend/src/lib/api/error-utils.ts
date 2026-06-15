import axios from 'axios';
import {
  ERROR_MAP,
  DEFAULT_ERROR_MESSAGE,
  NETWORK_ERROR_MESSAGE,
} from './error-map';

export interface ApiErrorPayload {
  codigo: string;
  mensaje: string;
  detalles?: { campo: string; mensaje: string }[];
}

export function getErrorMessage(error: unknown): string {
  // 1. Network / no response
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return NETWORK_ERROR_MESSAGE;
    }

    const payload = error.response.data?.error as ApiErrorPayload | undefined;

    if (payload) {
      // Validation errors with details
      if (payload.codigo === 'VALIDACION' && payload.detalles && payload.detalles.length > 0) {
        const details = payload.detalles
          .map((d) => `${d.campo}: ${d.mensaje}`)
          .join(' / ');
        return `Datos inválidos: ${details}`;
      }

      // Mapped friendly message
      const mapped = ERROR_MAP[payload.codigo];
      if (mapped) {
        return mapped;
      }

      // Fallback to backend message if available
      if (payload.mensaje) {
        return payload.mensaje;
      }
    }

    // HTTP status based fallbacks
    const status = error.response.status;
    if (status === 401) {
      return 'Credenciales inválidas o sesión expirada.';
    }
    if (status === 403) {
      return 'No tienes permisos para realizar esta acción.';
    }
    if (status === 404) {
      return 'El recurso solicitado no fue encontrado.';
    }
    if (status === 409) {
      return 'La operación no se pudo completar porque hay un conflicto con los datos actuales.';
    }
    if (status >= 500) {
      return 'El servicio no está disponible en este momento. Intenta más tarde.';
    }
  }

  // 2. Non-axios errors (e.g. manual throws)
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return DEFAULT_ERROR_MESSAGE;
}
