/**
 * ============================================================================
 * Caso de uso: CrearCitaAutomatica
 * ============================================================================
 * Dado un paciente y una especialidad, busca el primer slot libre disponible
 * en los próximos 7 días entre todos los médicos activos de esa especialidad.
 * ============================================================================
 */

import { Result, Ok, Err } from '@clinica-x/shared-kernel';
import { Cita } from '@/modules/citas/domain/entities/cita.entity';
import { SlotNoDisponibleError, MedicoNoEncontradoError } from '@/modules/citas/domain/exceptions/cita.errors';
import type {
  ICrearCitaPort,
  CrearCitaDto,
  CitaResponseDto,
} from '@/modules/citas/domain/ports/in/citas.port';
import type { ICitaRepository } from '@/modules/citas/domain/ports/out/cita.repository.port';
import type { IMedicoConsultaPort } from '@/modules/citas/domain/ports/out/medico-consulta.port';
import { toCitaResponseDto } from '@/modules/citas/application/mapper';
import { nowLima, addDaysLima, getLimaDayOfWeek, startOfDayLima, endOfDayLima, buildLimaDate, formatLima } from '@clinica-x/date-utils';

const CUATRO_HORAS_MS = 4 * 60 * 60 * 1000;

export class CrearCitaAutomaticaUseCase implements ICrearCitaPort {
  constructor(
    private readonly repo: ICitaRepository,
    private readonly medicoReader: IMedicoConsultaPort,
  ) {}

  async execute(dto: CrearCitaDto): Promise<Result<CitaResponseDto, Error>> {
    const medicos = await this.medicoReader.buscarPorEspecialidadActiva(dto.medicoId); // dto.medicoId = especialidadId en modo automático
    if (medicos.length === 0) {
      return Err(new MedicoNoEncontradoError());
    }

    const ahora = nowLima();
    const maxDias = 7;

    for (let diaOffset = 0; diaOffset < maxDias; diaOffset++) {
      const fecha = addDaysLima(ahora, diaOffset);

      const diaSemana = getLimaDayOfWeek(fecha);

      for (const medico of medicos) {
        const horarios = await this.medicoReader.listarHorarios(medico.id, diaSemana);
        if (horarios.length === 0) continue;

        const inicioDia = startOfDayLima(fecha);
        const finDia = endOfDayLima(fecha);
        const citas = await this.repo.buscarPorMedicoYFecha(medico.id, inicioDia, finDia);

        for (const h of horarios) {
          let slotStart = this.parseTime(h.horaInicio, fecha);
          const slotEndMax = this.parseTime(h.horaFin, fecha);

          while (slotStart < slotEndMax) {
            const slotEnd = new Date(slotStart.getTime() + h.duracionSlot * 60 * 1000);
            if (slotEnd > slotEndMax) break;

            const slotDateTime = buildLimaDate(formatLima(fecha, 'yyyy-MM-dd'), formatLima(slotStart, 'HH:mm:ss'));

            const diffMs = slotDateTime.getTime() - ahora.getTime();
            if (diffMs >= CUATRO_HORAS_MS && !this.estaOcupado(slotStart, slotEnd, citas, h.duracionSlot)) {
              // Slot libre encontrado
              const id = crypto.randomUUID();
              const citaResult = Cita.create(id, {
                pacienteId: dto.pacienteId,
                medicoId: medico.id,
                fechaHora: slotDateTime,
                tipoReserva: 'AUTOMATICA',
                motivo: dto.motivo,
              });
              if (citaResult.isErr) return Err(citaResult.error);

              const inicioRango = new Date(slotDateTime.getTime() - 1);
              const finRango = new Date(slotDateTime.getTime() + h.duracionSlot * 60 * 1000);
              const guardada = await this.repo.guardarSiLibre(citaResult.value, inicioRango, finRango);
              if (!guardada) {
                continue; // El slot fue tomado por otro usuario concurrente; seguir buscando
              }

              const voucherCode = `VCH-${id.slice(0, 8).toUpperCase()}`;
              return Ok(
                toCitaResponseDto(citaResult.value, {
                  doctorName: medico.nombreUsuario,
                  specialty: medico.especialidadNombre,
                  voucherCode,
                }),
              );
            }

            slotStart = slotEnd;
          }
        }
      }
    }

    return Err(new SlotNoDisponibleError('No hay turnos disponibles para esta especialidad en los próximos días'));
  }

  private parseTime(timeStr: string, baseDate: Date): Date {
    const [h, m] = timeStr.split(':').map(Number);
    return buildLimaDate(formatLima(baseDate, 'yyyy-MM-dd'), `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
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
