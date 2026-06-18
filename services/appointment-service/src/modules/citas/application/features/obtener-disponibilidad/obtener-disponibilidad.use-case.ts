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
import { getLimaDayOfWeek, startOfDayLima, endOfDayLima, buildLimaDate, formatLima, nowLima } from '@clinica-x/date-utils';

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

    const diaSemana = getLimaDayOfWeek(dto.fecha); // 1=Lunes ... 7=Domingo
    const horarios = await this.medicoReader.listarHorarios(dto.medicoId, diaSemana);

    const ahora = nowLima();

    // Obtener citas existentes para esa fecha
    const inicioDia = startOfDayLima(dto.fecha);
    const finDia = endOfDayLima(dto.fecha);
    const citas = await this.repo.buscarPorMedicoYFecha(dto.medicoId, inicioDia, finDia);

    const slots: SlotDto[] = [];

    for (const h of horarios) {
      let slotStart = this.parseTime(h.horaInicio, dto.fecha);
      const slotEndMax = this.parseTime(h.horaFin, dto.fecha);

      while (slotStart < slotEndMax) {
        const slotEnd = new Date(slotStart.getTime() + h.duracionSlot * 60 * 1000);
        if (slotEnd > slotEndMax) break;

        const enPasado = slotStart <= ahora;
        const disponible = !enPasado && !this.estaOcupado(slotStart, slotEnd, citas, h.duracionSlot);
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

  private parseTime(timeStr: string, baseDate: Date): Date {
    const [h, m] = timeStr.split(':').map(Number);
    return buildLimaDate(formatLima(baseDate, 'yyyy-MM-dd'), `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
  }

  private formatTime(date: Date): string {
    return formatLima(date, 'HH:mm');
  }

  private estaOcupado(inicio: Date, fin: Date, citas: { fechaHora: Date }[], duracionSlotMinutos: number): boolean {
    for (const c of citas) {
      const citaInicio = c.fechaHora;
      const citaFin = new Date(citaInicio.getTime() + duracionSlotMinutos * 60 * 1000);
      if (inicio < citaFin && fin > citaInicio) {
        return true;
      }
    }
    return false;
  }
}
