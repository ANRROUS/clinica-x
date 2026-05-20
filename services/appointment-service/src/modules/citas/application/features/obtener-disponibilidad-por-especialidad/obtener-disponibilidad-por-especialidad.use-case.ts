/**
 * ============================================================================
 * Caso de uso: ObtenerDisponibilidadPorEspecialidad
 * ============================================================================
 * Retorna disponibilidad para todos los médicos activos de una especialidad.
 * ============================================================================
 */

import { Result, Ok } from '@clinica-x/shared-kernel';
import type {
  IObtenerDisponibilidadPorEspecialidadPort,
  ObtenerDisponibilidadPorEspecialidadDto,
  DisponibilidadDoctorDto,
  SlotDto,
} from '@/modules/citas/domain/ports/in/citas.port';
import type { ICitaRepository } from '@/modules/citas/domain/ports/out/cita.repository.port';
import type { IMedicoConsultaPort } from '@/modules/citas/domain/ports/out/medico-consulta.port';
import { nowLima, addDaysLima, getLimaDayOfWeek, startOfDayLima, endOfDayLima, buildLimaDate, formatLima } from '@clinica-x/date-utils';

export class ObtenerDisponibilidadPorEspecialidadUseCase implements IObtenerDisponibilidadPorEspecialidadPort {
  constructor(
    private readonly repo: ICitaRepository,
    private readonly medicoReader: IMedicoConsultaPort,
  ) {}

  async execute(dto: ObtenerDisponibilidadPorEspecialidadDto): Promise<Result<DisponibilidadDoctorDto[], Error>> {
    const medicos = await this.medicoReader.buscarPorEspecialidadActiva(dto.especialidadId);
    const resultado: DisponibilidadDoctorDto[] = [];

    const fechaBase = dto.fechaDesde ?? nowLima();
    const diasAVerificar = 7; // Próximos 7 días

    for (const medico of medicos) {
      const dias: { fecha: string; slots: SlotDto[] }[] = [];

      for (let i = 0; i < diasAVerificar; i++) {
        const fecha = addDaysLima(fechaBase, i);

        const diaSemana = getLimaDayOfWeek(fecha);
        const horarios = await this.medicoReader.listarHorarios(medico.id, diaSemana);

        if (horarios.length === 0) continue;

        const inicioDia = startOfDayLima(fecha);
        const finDia = endOfDayLima(fecha);
        const citas = await this.repo.buscarPorMedicoYFecha(medico.id, inicioDia, finDia);

        const slots: SlotDto[] = [];
        for (const h of horarios) {
          let slotStart = this.parseTime(h.horaInicio, fecha);
          const slotEndMax = this.parseTime(h.horaFin, fecha);
          while (slotStart < slotEndMax) {
            const slotEnd = new Date(slotStart.getTime() + h.duracionSlot * 60 * 1000);
            if (slotEnd > slotEndMax) break;
            const disponible = !this.estaOcupado(slotStart, slotEnd, citas, h.duracionSlot);
            slots.push({
              horaInicio: this.formatTime(slotStart),
              horaFin: this.formatTime(slotEnd),
              disponible,
            });
            slotStart = slotEnd;
          }
        }

        if (slots.length > 0) {
          dias.push({ fecha: formatLima(fecha, 'yyyy-MM-dd'), slots });
        }
      }

      if (dias.length > 0) {
        resultado.push({
          doctorId: medico.id,
          doctorName: medico.nombreUsuario,
          specialty: medico.especialidadNombre,
          dias,
        });
      }
    }

    return Ok(resultado);
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
