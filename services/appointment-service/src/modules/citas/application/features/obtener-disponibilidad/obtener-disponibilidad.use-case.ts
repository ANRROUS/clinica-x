/**
 * ============================================================================
 * Caso de uso: ObtenerDisponibilidad
 * ============================================================================
 * Dado un médico y una fecha, retorna los slots libres de 30 minutos.
 * ============================================================================
 */

import { Result, Ok, Err } from '@clinica-x/shared-kernel';
import { MedicoNoEncontradoError } from '@/modules/citas/domain/exceptions/cita.errors';
import type {
  IObtenerDisponibilidadPort,
  ObtenerDisponibilidadDto,
  SlotDto,
} from '@/modules/citas/domain/ports/in/citas.port';
import type { ICitaRepository } from '@/modules/citas/domain/ports/out/cita.repository.port';
import type { IMedicoConsultaPort } from '@/modules/citas/domain/ports/out/medico-consulta.port';

export class ObtenerDisponibilidadUseCase implements IObtenerDisponibilidadPort {
  constructor(
    private readonly repo: ICitaRepository,
    private readonly medicoReader: IMedicoConsultaPort,
  ) {}

  async execute(dto: ObtenerDisponibilidadDto): Promise<Result<SlotDto[], Error>> {
    const medico = await this.medicoReader.buscarPorId(dto.medicoId);
    if (!medico) {
      return Err(new MedicoNoEncontradoError(dto.medicoId));
    }

    const diaSemana = dto.fecha.getDay() === 0 ? 7 : dto.fecha.getDay(); // 1=Lunes ... 7=Domingo
    const horarios = await this.medicoReader.listarHorarios(dto.medicoId, diaSemana);

    // Obtener citas existentes para esa fecha
    const inicioDia = new Date(dto.fecha);
    inicioDia.setHours(0, 0, 0, 0);
    const finDia = new Date(dto.fecha);
    finDia.setHours(23, 59, 59, 999);
    const citas = await this.repo.buscarPorMedicoYFecha(dto.medicoId, inicioDia, finDia);

    const slots: SlotDto[] = [];

    for (const h of horarios) {
      let slotStart = this.parseTime(h.horaInicio);
      const slotEndMax = this.parseTime(h.horaFin);

      while (slotStart < slotEndMax) {
        const slotEnd = new Date(slotStart.getTime() + h.duracionSlot * 60 * 1000);
        if (slotEnd > slotEndMax) break;

        const disponible = !this.estaOcupado(slotStart, slotEnd, citas);
        slots.push({
          horaInicio: this.formatTime(slotStart),
          horaFin: this.formatTime(slotEnd),
          disponible,
        });

        slotStart = slotEnd;
      }
    }

    return Ok(slots);
  }

  private parseTime(timeStr: string): Date {
    const [h, m] = timeStr.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  }

  private formatTime(date: Date): string {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }

  private estaOcupado(inicio: Date, fin: Date, citas: { fechaHora: Date }[]): boolean {
    for (const c of citas) {
      const citaInicio = new Date(c.fechaHora);
      const citaFin = new Date(citaInicio.getTime() + 30 * 60 * 1000);
      if (inicio < citaFin && fin > citaInicio) {
        return true;
      }
    }
    return false;
  }
}
