/**
 * ============================================================================
 * Caso de uso: CrearCitaAutomatica
 * ============================================================================
 * Dado un paciente y una especialidad, busca el slot disponible más próximo
 * entre todos los médicos activos de esa especialidad y reserva la cita.
 *
 * Algoritmo (refactorizado):
 *  1. Obtener médicos activos de la especialidad.
 *  2. Por cada día (0..6), encontrar el primer slot libre de cada médico.
 *  3. Ordenar los candidatos del día por fecha ascendente.
 *  4. Intentar reservar en orden, con control de concurrencia.
 *  5. Si ningún candidato funciona, pasar al día siguiente.
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
import type {
  IMedicoConsultaPort,
  MedicoConsulta,
  HorarioConsulta,
} from '@/modules/citas/domain/ports/out/medico-consulta.port';
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

    for (let diaOffset = 0; diaOffset < maxDias; diaOffset++) {
      const fecha = addDaysLima(ahora, diaOffset);
      const diaSemana = getLimaDayOfWeek(fecha);
      const inicioDia = startOfDayLima(fecha);
      const finDia = endOfDayLima(fecha);

      interface Candidato {
        slotDateTime: Date;
        medico: MedicoConsulta;
        horario: HorarioConsulta;
      }

      const candidatos: Candidato[] = [];

      for (const medico of medicos) {
        const horarios = await this.medicoReader.listarHorarios(medico.id, diaSemana);
        if (horarios.length === 0) continue;

        const citas = await this.repo.buscarPorMedicoYFecha(medico.id, inicioDia, finDia);

        const citasPacienteConMedico = await this.repo.buscarPorPacienteMedicoYDia(
          dto.pacienteId,
          medico.id,
          inicioDia,
          finDia,
        );
        if (citasPacienteConMedico.length > 0) continue;

        for (const h of horarios) {
          let slotStart = this.parseTime(h.horaInicio, fecha);
          const slotEndMax = this.parseTime(h.horaFin, fecha);
          let slotEncontrado = false;

          while (slotStart < slotEndMax && !slotEncontrado) {
            const slotEnd = new Date(slotStart.getTime() + h.duracionSlot * 60 * 1000);
            if (slotEnd > slotEndMax) break;

            const slotDateTime = buildLimaDate(
              formatLima(fecha, 'yyyy-MM-dd'),
              formatLima(slotStart, 'HH:mm:ss'),
            );

            const diffMs = slotDateTime.getTime() - ahora.getTime();
            if (
              diffMs > 0 &&
              !this.estaOcupado(slotStart, slotEnd, citas, h.duracionSlot)
            ) {
              candidatos.push({ slotDateTime, medico, horario: h });
              slotEncontrado = true;
            }

            slotStart = slotEnd;
          }
          if (slotEncontrado) break;
        }
      }

      if (candidatos.length === 0) continue;

      // Análisis matemático: ordenar por fecha ascendente
      candidatos.sort((a, b) => a.slotDateTime.getTime() - b.slotDateTime.getTime());

      for (const { slotDateTime, medico, horario } of candidatos) {
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
        const finRango = new Date(slotDateTime.getTime() + horario.duracionSlot * 60 * 1000);
        const guardada = await this.repo.guardarSiLibre(
          citaResult.value,
          inicioRango,
          finRango,
        );

        if (guardada) {
          const voucherCode = `VCH-${id.slice(0, 8).toUpperCase()}`;
          return Ok(
            toCitaResponseDto(citaResult.value, {
              doctorName: medico.nombreUsuario,
              specialty: medico.especialidadNombre,
              voucherCode,
            }),
          );
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
