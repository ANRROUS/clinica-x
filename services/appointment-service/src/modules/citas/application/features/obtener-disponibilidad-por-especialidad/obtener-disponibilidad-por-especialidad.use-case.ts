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

export class ObtenerDisponibilidadPorEspecialidadUseCase implements IObtenerDisponibilidadPorEspecialidadPort {
  constructor(
    private readonly repo: ICitaRepository,
    private readonly medicoReader: IMedicoConsultaPort,
  ) {}

  async execute(dto: ObtenerDisponibilidadPorEspecialidadDto): Promise<Result<DisponibilidadDoctorDto[], Error>> {
    const medicos = await this.medicoReader.buscarPorEspecialidadActiva(dto.especialidadId);
    const resultado: DisponibilidadDoctorDto[] = [];

    const fechaBase = dto.fechaDesde ?? new Date();
    const diasAVerificar = 7; // Próximos 7 días

    for (const medico of medicos) {
      const dias: { fecha: string; slots: SlotDto[] }[] = [];

      for (let i = 0; i < diasAVerificar; i++) {
        const fecha = new Date(fechaBase);
        fecha.setDate(fecha.getDate() + i);

        const diaSemana = fecha.getDay() === 0 ? 7 : fecha.getDay();
        const horarios = await this.medicoReader.listarHorarios(medico.id, diaSemana);

        if (horarios.length === 0) continue;

        const inicioDia = new Date(fecha);
        inicioDia.setHours(0, 0, 0, 0);
        const finDia = new Date(fecha);
        finDia.setHours(23, 59, 59, 999);
        const citas = await this.repo.buscarPorMedicoYFecha(medico.id, inicioDia, finDia);

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

        if (slots.length > 0) {
          dias.push({ fecha: fecha.toISOString().split('T')[0], slots });
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
