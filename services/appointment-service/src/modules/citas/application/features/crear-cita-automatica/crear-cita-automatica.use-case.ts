/**
 * ============================================================================
 * Caso de uso: CrearCitaAutomatica
 * ============================================================================
 * Dado un paciente y una especialidad, busca el primer slot libre disponible
 * en los próximos 7 días entre todos los médicos activos de esa especialidad.
 * Optimizado con batch queries para evitar N+1.
 * ============================================================================
 */

import { Result, Ok, Err } from '@clinica-x/shared-kernel';
import { Cita } from '@/modules/citas/domain/entities/cita.entity';
import {
  SlotNoDisponibleError,
  MedicoNoEncontradoError,
} from '@/modules/citas/domain/exceptions/cita.errors';
import type {
  ICrearCitaPort,
  CrearCitaDto,
  CitaResponseDto,
} from '@/modules/citas/domain/ports/in/citas.port';
import type { ICitaRepository } from '@/modules/citas/domain/ports/out/cita.repository.port';
import type { IMedicoConsultaPort } from '@/modules/citas/domain/ports/out/medico-consulta.port';
import { toCitaResponseDto } from '@/modules/citas/application/mapper';
import {
  nowLima,
  addDaysLima,
  getLimaDayOfWeek,
  startOfDayLima,
  endOfDayLima,
  buildLimaDate,
  formatLima,
} from '@clinica-x/date-utils';

const CUATRO_HORAS_MS = 4 * 60 * 60 * 1000;

export class CrearCitaAutomaticaUseCase implements ICrearCitaPort {
  constructor(
    private readonly repo: ICitaRepository,
    private readonly medicoReader: IMedicoConsultaPort,
  ) {}

  async execute(dto: CrearCitaDto): Promise<Result<CitaResponseDto, Error>> {
    const medicos = await this.medicoReader.buscarPorEspecialidadActiva(dto.medicoId);
    if (medicos.length === 0) {
      return Err(new MedicoNoEncontradoError());
    }

    const ahora = nowLima();
    const maxDias = 7;
    const medicoIds = medicos.map((m) => m.id);

    const diasSemanaSet = new Set<number>();
    for (let i = 0; i < maxDias; i++) {
      diasSemanaSet.add(getLimaDayOfWeek(addDaysLima(ahora, i)));
    }
    const diasSemana = Array.from(diasSemanaSet);

    // Batch queries
    const horariosMap = await this.medicoReader.listarHorariosPorMedicos(medicoIds, diasSemana);

    const inicioRango = startOfDayLima(ahora);
    const finRango = endOfDayLima(addDaysLima(ahora, maxDias - 1));
    const todasLasCitas = await this.repo.buscarPorMedicosYFecha(medicoIds, inicioRango, finRango);

    const citasPorMedico = new Map<string, typeof todasLasCitas>();
    for (const cita of todasLasCitas) {
      const lista = citasPorMedico.get(cita.medicoId);
      if (lista) {
        lista.push(cita);
      } else {
        citasPorMedico.set(cita.medicoId, [cita]);
      }
    }

    const citasPaciente = await this.repo.buscarPorPaciente(dto.pacienteId);
    const citasPacienteActivas = citasPaciente.filter(
      (c: any) =>
        c.estado !== 'CANCELADA' &&
        c.fechaHora >= inicioRango &&
        c.fechaHora <= finRango,
    );

    for (let diaOffset = 0; diaOffset < maxDias; diaOffset++) {
      const fecha = addDaysLima(ahora, diaOffset);
      const diaSemana = getLimaDayOfWeek(fecha);
      const inicioDia = startOfDayLima(fecha);
      const finDia = endOfDayLima(fecha);

      for (const medico of medicos) {
        const key = `${medico.id}#${diaSemana}`;
        const horarios = horariosMap.get(key) ?? [];
        if (horarios.length === 0) continue;

        const citasDelMedico = citasPorMedico.get(medico.id) ?? [];
        const citasDelDia = citasDelMedico.filter(
          (c: any) => c.fechaHora >= inicioDia && c.fechaHora <= finDia,
        );

        const yaTieneCita = citasPacienteActivas.some(
          (c: any) => c.medicoId === medico.id,
        );
        if (yaTieneCita) continue;

        for (const h of horarios) {
          let slotStart = this.parseTime(h.horaInicio, fecha);
          const slotEndMax = this.parseTime(h.horaFin, fecha);

          while (slotStart < slotEndMax) {
            const slotEnd = new Date(slotStart.getTime() + h.duracionSlot * 60 * 1000);
            if (slotEnd > slotEndMax) break;

            const slotDateTime = buildLimaDate(
              formatLima(fecha, 'yyyy-MM-dd'),
              formatLima(slotStart, 'HH:mm:ss'),
            );

            const diffMs = slotDateTime.getTime() - ahora.getTime();
            if (
              diffMs >= CUATRO_HORAS_MS &&
              !this.estaOcupado(slotStart, slotEnd, citasDelDia, h.duracionSlot)
            ) {
              const id = crypto.randomUUID();
              const citaResult = Cita.create(id, {
                pacienteId: dto.pacienteId,
                medicoId: medico.id,
                fechaHora: slotDateTime,
                tipoReserva: 'AUTOMATICA',
                motivo: dto.motivo,
              });
              if (citaResult.isErr) return Err(citaResult.error);

              const inicioRangoSlot = new Date(slotDateTime.getTime() - 1);
              const finRangoSlot = new Date(slotDateTime.getTime() + h.duracionSlot * 60 * 1000);
              const guardada = await this.repo.guardarSiLibre(
                citaResult.value,
                inicioRangoSlot,
                finRangoSlot,
              );
              if (!guardada) {
                continue;
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

    return Err(
      new SlotNoDisponibleError(
        'No hay turnos disponibles para esta especialidad en los próximos días',
      ),
    );
  }

  private parseTime(timeStr: string, baseDate: Date): Date {
    const [h, m] = timeStr.split(':').map(Number);
    return buildLimaDate(
      formatLima(baseDate, 'yyyy-MM-dd'),
      `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`,
    );
  }

  private estaOcupado(
    inicio: Date,
    fin: Date,
    citas: { fechaHora: Date }[],
    duracionSlotMinutos: number,
  ): boolean {
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
