import { prisma } from '@/shared/prisma-client';
import type { HeaderData, ParsedGroup, ParsedItem } from '../../../../application/features/procesar-ocr/OcrParser';
import type { TipoAnalisis } from '@clinica-x/shared-types';
import { logger } from '@/shared/logger';

export interface AnalisisRepository {
  createResultado(input: {
    ordenAnalisisId?: string | null;
    pacienteId: string;
    archivoId: string;
    consultaId?: string | null;
    tipoAnalisis: string;
    resultadoIdOriginal?: string | null;
    laboratorio?: string | null;
    medicoSolicitante?: string | null;
    fechaToma?: Date | null;
    horaToma?: string | null;
    fechaResultado?: Date | null;
    datosMuestra?: any | null;
    pacienteNombreOcr?: string | null;
    pacienteIdOcr?: string | null;
    pacienteFechaNacimiento?: Date | null;
    pacienteSexo?: string | null;
    pacienteEdad?: number | null;
    grupos: {
      nombreGrupo: string;
      orden: number;
      items: {
        nombre: string;
        valor: string;
        unidad?: string | null;
        rangoMin?: string | null;
        rangoMax?: string | null;
        rangoReferencia?: string | null;
        estado?: string | null;
        nota?: string | null;
        orden: number;
      }[];
    }[];
  }): Promise<string>;

  createGrupo(
    analisisResultadoId: string,
    nombreGrupo: string,
    orden: number,
    items: {
      nombre: string;
      valor: string;
      unidad?: string | null;
      rangoMin?: string | null;
      rangoMax?: string | null;
      rangoReferencia?: string | null;
      estado?: string | null;
      nota?: string | null;
      orden: number;
    }[],
  ): Promise<string>;

  markError(id: string, error: string): Promise<void>;
  markCompleted(id: string): Promise<void>;

  getByArchivoId(archivoId: string): Promise<{
    id: string;
    tipoAnalisis: string;
    estadoOcr: string;
    errorOcr: string | null;
    laboratorio: string | null;
    medicoSolicitante: string | null;
    fechaToma: Date | null;
    horaToma: string | null;
    fechaResultado: Date | null;
    datosMuestra: any | null;
    resultadoIdOriginal: string | null;
    pacienteNombreOcr: string | null;
    pacienteIdOcr: string | null;
    pacienteSexo: string | null;
    pacienteEdad: number | null;
    grupos: {
      id: string;
      nombreGrupo: string;
      orden: number;
      items: {
        id: string;
        nombre: string;
        valor: string;
        unidad: string | null;
        rangoMin: string | null;
        rangoMax: string | null;
        rangoReferencia: string | null;
        estado: string | null;
        nota: string | null;
        orden: number;
      }[];
    }[];
  } | null>;

  getByOrdenAnalisisId(ordenAnalisisId: string): Promise<{
    id: string;
    tipoAnalisis: string;
    estadoOcr: string;
    errorOcr: string | null;
    archivoId: string;
    grupos: {
      id: string;
      nombreGrupo: string;
      orden: number;
      items: {
        id: string;
        nombre: string;
        valor: string;
        unidad: string | null;
        rangoMin: string | null;
        rangoMax: string | null;
        rangoReferencia: string | null;
        estado: string | null;
        nota: string | null;
        orden: number;
      }[];
    }[];
  } | null>;

  listByPacienteId(pacienteId: string): Promise<{
    id: string;
    tipoAnalisis: string;
    estadoOcr: string;
    archivoId: string;
    laboratorio: string | null;
    fechaResultado: Date | null;
    creadoEn: Date;
  }[]>;
}

function parseDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    const parts = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (parts) {
      return new Date(parseInt(parts[1]), parseInt(parts[2]) - 1, parseInt(parts[3]));
    }
    return undefined;
  }
  return date;
}

export class PrismaAnalisisRepository implements AnalisisRepository {
  async createResultado(input: {
    ordenAnalisisId?: string;
    pacienteId: string;
    archivoId: string;
    consultaId?: string;
    tipoAnalisis: string;
    resultadoIdOriginal?: string;
    laboratorio?: string;
    medicoSolicitante?: string;
    fechaToma?: Date;
    horaToma?: string;
    fechaResultado?: Date;
    datosMuestra?: Record<string, unknown>;
    pacienteNombreOcr?: string;
    pacienteIdOcr?: string;
    pacienteFechaNacimiento?: Date;
    pacienteSexo?: string;
    pacienteEdad?: number;
    grupos: {
      nombreGrupo: string;
      orden: number;
      items: {
        nombre: string;
        valor: string;
        unidad?: string;
        rangoMin?: string;
        rangoMax?: string;
        rangoReferencia?: string;
        estado?: string;
        nota?: string;
        orden: number;
      }[];
    }[];
  }): Promise<string> {
    const result = await prisma.analisisResultado.create({
      data: {
        ordenAnalisisId: input.ordenAnalisisId,
        pacienteId: input.pacienteId,
        archivoId: input.archivoId,
        consultaId: input.consultaId,
        tipoAnalisis: input.tipoAnalisis,
        resultadoIdOriginal: input.resultadoIdOriginal,
        laboratorio: input.laboratorio,
        medicoSolicitante: input.medicoSolicitante,
        fechaToma: input.fechaToma,
        horaToma: input.horaToma,
        fechaResultado: input.fechaResultado,
        datosMuestra: input.datosMuestra as any,
        pacienteNombreOcr: input.pacienteNombreOcr,
        pacienteIdOcr: input.pacienteIdOcr,
        pacienteFechaNacimiento: input.pacienteFechaNacimiento,
        pacienteSexo: input.pacienteSexo,
        pacienteEdad: input.pacienteEdad,
        estadoOcr: 'PROCESANDO',
        grupos: {
          create: input.grupos.map((g) => ({
            nombreGrupo: g.nombreGrupo,
            orden: g.orden,
            items: {
              create: g.items.map((item) => ({
                nombre: item.nombre,
                valor: item.valor,
                unidad: item.unidad,
                rangoMin: item.rangoMin,
                rangoMax: item.rangoMax,
                rangoReferencia: item.rangoReferencia,
                estado: item.estado,
                nota: item.nota,
                orden: item.orden,
              })),
            },
          })),
        },
      },
      include: { grupos: { include: { items: true } } },
    });

    logger.info({ id: result.id, tipo: input.tipoAnalisis }, 'Resultado OCR creado');

    return result.id;
  }

  async createGrupo(
    analisisResultadoId: string,
    nombreGrupo: string,
    orden: number,
    items: {
      nombre: string;
      valor: string;
      unidad?: string;
      rangoMin?: string;
      rangoMax?: string;
      rangoReferencia?: string;
      estado?: string;
      nota?: string;
      orden: number;
    }[],
  ): Promise<string> {
    const grupo = await prisma.analisisGrupo.create({
      data: {
        analisisResultadoId,
        nombreGrupo,
        orden,
        items: {
          create: items.map((item) => ({
            nombre: item.nombre,
            valor: item.valor,
            unidad: item.unidad,
            rangoMin: item.rangoMin,
            rangoMax: item.rangoMax,
            rangoReferencia: item.rangoReferencia,
            estado: item.estado,
            nota: item.nota,
            orden: item.orden,
          })),
        },
      },
    });
    return grupo.id;
  }

  async markError(id: string, error: string): Promise<void> {
    await prisma.analisisResultado.update({
      where: { id },
      data: { estadoOcr: 'ERROR', errorOcr: error },
    });
    logger.warn({ id, error }, 'Resultado OCR marcado como ERROR');
  }

  async markCompleted(id: string): Promise<void> {
    await prisma.analisisResultado.update({
      where: { id },
      data: { estadoOcr: 'COMPLETADO' },
    });
    logger.info({ id }, 'Resultado OCR marcado como COMPLETADO');
  }

  async getByArchivoId(archivoId: string) {
    const result = await prisma.analisisResultado.findUnique({
      where: { archivoId },
      include: {
        grupos: {
          orderBy: { orden: 'asc' },
          include: {
            items: { orderBy: { orden: 'asc' } },
          },
        },
      },
    });
    return result;
  }

  async getByOrdenAnalisisId(ordenAnalisisId: string) {
    const result = await prisma.analisisResultado.findUnique({
      where: { ordenAnalisisId },
      include: {
        grupos: {
          orderBy: { orden: 'asc' },
          include: {
            items: { orderBy: { orden: 'asc' } },
          },
        },
      },
    });
    return result;
  }

  async listByPacienteId(pacienteId: string) {
    const results = await prisma.analisisResultado.findMany({
      where: { pacienteId },
      orderBy: { creadoEn: 'desc' },
      select: {
        id: true,
        tipoAnalisis: true,
        estadoOcr: true,
        archivoId: true,
        laboratorio: true,
        fechaResultado: true,
        creadoEn: true,
      },
    });
    return results;
  }
}
