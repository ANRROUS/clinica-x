/**
 * ============================================================================
 * LogContext — Tipos para el sistema de logs estructurados JSON
 * ============================================================================
 *
 * Define la estructura estándar para todos los logs del sistema.
 * Permite trazar una petición a través de todas las capas de la arquitectura
 * hexagonal: Controller → Application → Domain → Infrastructure
 *
 * Niveles de log (Pino):
 *   - trace (10): Máximo detalle, datos sensibles enmascarados
 *   - debug (20): Detalle técnico, DTOs, queries
 *   - info  (30): Flujo normal del negocio
 *   - warn  (40): Situación inesperada pero manejable
 *   - error (50): Error que afecta al usuario
 *   - fatal (60): Sistema caído
 * ============================================================================
 */

export type LayerType =
  | 'controller'
  | 'application'
  | 'domain'
  | 'infrastructure';

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface TraceInfo {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  requestId: string;
}

export interface LogContext {
  service: string;
  env: string;
  trace: TraceInfo;
  ctx: {
    module: string;
    feature: string;
    layer: LayerType;
    action: string;
  };
}

export interface HttpLogInfo {
  method?: string;
  path?: string;
  status?: number;
  ip?: string;
  userAgent?: string;
  durationMs?: number;
}

export interface ErrorLogInfo {
  name?: string;
  message: string;
  code?: string;
  stack?: string;
  [key: string]: any;
}

export interface LogData {
  input?: Record<string, any>;
  output?: Record<string, any>;
  error?: ErrorLogInfo;
  durationMs?: number;
  httpMethod?: string;
  httpPath?: string;
  [key: string]: any;
}
