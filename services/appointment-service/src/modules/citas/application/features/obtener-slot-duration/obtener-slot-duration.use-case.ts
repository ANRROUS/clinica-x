import { Result, Ok } from '@clinica-x/shared-kernel';
import type { IMedicoConsultaPort } from '@/modules/citas/domain/ports/out/medico-consulta.port';

export interface SlotDurationResponse {
  duracionSlot: number;
}

export interface IObtenerSlotDurationPort {
  execute(medicoId: string): Promise<Result<SlotDurationResponse, Error>>;
}

export class ObtenerSlotDurationUseCase implements IObtenerSlotDurationPort {
  constructor(
    private readonly medicoReader: IMedicoConsultaPort,
  ) {}

  async execute(medicoId: string): Promise<Result<SlotDurationResponse, Error>> {
    const DEFAULT_SLOT_DURATION = 30;

    const horarios = await this.medicoReader.listarHorarios(medicoId, new Date().getDay() || 7);

    if (horarios.length === 0) {
      const medico = await this.medicoReader.buscarPorId(medicoId);
      if (!medico) {
        return Ok({ duracionSlot: DEFAULT_SLOT_DURATION });
      }
      const allHorarios = await this.medicoReader.listarHorarios(medicoId, 1);
      if (allHorarios.length > 0) {
        return Ok({ duracionSlot: allHorarios[0].duracionSlot });
      }
      return Ok({ duracionSlot: DEFAULT_SLOT_DURATION });
    }

    return Ok({ duracionSlot: horarios[0].duracionSlot });
  }
}