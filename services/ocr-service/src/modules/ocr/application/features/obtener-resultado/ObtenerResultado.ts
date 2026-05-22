import type { AnalisisResultadoDTO, AnalisisGrupoDTO, AnalisisItemDTO } from '@clinica-x/shared-types';
import type { AnalisisRepository } from '../../../infrastructure/adapters/out/persistence/PrismaAnalisisRepository';

export class ObtenerResultado {
  constructor(private readonly repository: AnalisisRepository) {}

  async byArchivoId(archivoId: string): Promise<AnalisisResultadoDTO | null> {
    const result = await this.repository.getByArchivoId(archivoId);
    if (!result) return null;

    return this.toDTO(result);
  }

  async byOrdenAnalisisId(ordenAnalisisId: string): Promise<AnalisisResultadoDTO | null> {
    const result = await this.repository.getByOrdenAnalisisId(ordenAnalisisId);
    if (!result) return null;

    return this.toDTO(result);
  }

  async listByPacienteId(pacienteId: string): Promise<AnalisisResultadoDTO[]> {
    const results = await this.repository.listByPacienteId(pacienteId);
    return results.map((r) => ({
      id: r.id,
      tipoAnalisis: r.tipoAnalisis as any,
      archivoId: r.archivoId,
      laboratorio: r.laboratorio || undefined,
      fechaResultado: r.fechaResultado?.toISOString(),
      estadoOcr: r.estadoOcr as any,
      pacienteId: '',
      creadoEn: r.creadoEn.toISOString(),
      grupos: [],
    }));
  }

  private toDTO(result: any): AnalisisResultadoDTO {
    return {
      id: result.id,
      ordenAnalisisId: result.ordenAnalisisId || undefined,
      pacienteId: result.pacienteId,
      archivoId: result.archivoId,
      consultaId: result.consultaId || undefined,
      tipoAnalisis: result.tipoAnalisis,
      resultadoIdOriginal: result.resultadoIdOriginal || undefined,
      laboratorio: result.laboratorio || undefined,
      medicoSolicitante: result.medicoSolicitante || undefined,
      fechaToma: result.fechaToma?.toISOString() || undefined,
      horaToma: result.horaToma || undefined,
      fechaResultado: result.fechaResultado?.toISOString() || undefined,
      datosMuestra: result.datosMuestra || undefined,
      pacienteNombreOcr: result.pacienteNombreOcr || undefined,
      pacienteIdOcr: result.pacienteIdOcr || undefined,
      pacienteSexo: result.pacienteSexo || undefined,
      pacienteEdad: result.pacienteEdad || undefined,
      estadoOcr: result.estadoOcr,
      errorOcr: result.errorOcr || undefined,
      grupos: (result.grupos || []).map((g: any): AnalisisGrupoDTO => ({
        id: g.id,
        nombreGrupo: g.nombreGrupo,
        orden: g.orden,
        items: (g.items || []).map((item: any): AnalisisItemDTO => ({
          id: item.id,
          nombre: item.nombre,
          valor: item.valor,
          unidad: item.unidad || undefined,
          rangoMin: item.rangoMin || undefined,
          rangoMax: item.rangoMax || undefined,
          rangoReferencia: item.rangoReferencia || undefined,
          estado: item.estado || undefined,
          nota: item.nota || undefined,
          orden: item.orden,
        })),
      })),
      creadoEn: result.creadoEn.toISOString(),
    };
  }
}
