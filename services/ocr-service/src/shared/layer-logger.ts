/**
 * ============================================================================
 * layerLogger — Helper de logging por capas de la arquitectura hexagonal
 * ============================================================================
 */

import { randomUUID } from 'crypto';
import type { Request } from 'express';
import { logger } from './logger';
import type { TraceInfo, LayerType, LogData } from '@clinica-x/shared-kernel';
import { maskSensitiveData } from '@clinica-x/shared-kernel';

export function getTraceFromRequest(req: Request): TraceInfo {
  if (req.traceInfo) return req.traceInfo;
  return {
    traceId: req.header('x-trace-id') || randomUUID(),
    spanId: randomUUID(),
    requestId: req.requestId || randomUUID(),
  };
}

export function createLayerLogger(
  serviceName: string,
  trace: TraceInfo,
  module: string,
  feature: string
) {
  const baseContext = {
    service: serviceName,
    trace,
    ctx: { module, feature },
  };

  return {
    info: (layer: LayerType, action: string, data?: LogData) => {
      logger.info({
        ...baseContext,
        ctx: { ...baseContext.ctx, layer, action },
        data,
        msg: `[${layer}] ${action}`,
      });
    },

    debug: (layer: LayerType, action: string, data?: LogData) => {
      logger.debug({
        ...baseContext,
        ctx: { ...baseContext.ctx, layer, action },
        data: data ? maskSensitiveData(data) : undefined,
        msg: `[${layer}] ${action}`,
      });
    },

    warn: (layer: LayerType, action: string, data?: LogData) => {
      logger.warn({
        ...baseContext,
        ctx: { ...baseContext.ctx, layer, action },
        data,
        msg: `[${layer}] ${action}`,
      });
    },

    error: (layer: LayerType, action: string, err: Error, data?: LogData) => {
      logger.error({
        ...baseContext,
        ctx: { ...baseContext.ctx, layer, action },
        err: {
          name: err.name,
          message: err.message,
          stack: err.stack,
        },
        data,
        msg: `[${layer}] ${action}: ${err.message}`,
      });
    },

    fatal: (layer: LayerType, action: string, err: Error, data?: LogData) => {
      logger.fatal({
        ...baseContext,
        ctx: { ...baseContext.ctx, layer, action },
        err: {
          name: err.name,
          message: err.message,
          stack: err.stack,
        },
        data,
        msg: `[${layer}] ${action}: ${err.message}`,
      });
    },
  };
}

export type LayerLogger = ReturnType<typeof createLayerLogger>;
