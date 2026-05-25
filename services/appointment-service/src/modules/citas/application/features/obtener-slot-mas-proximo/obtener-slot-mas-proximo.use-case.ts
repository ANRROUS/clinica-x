/**
 * ============================================================================
 * Caso de uso: ObtenerSlotMasProximo
 * ============================================================================
 * Dado un paciente y una especialidad, retorna el slot disponible más próximo
 * entre todos los médicos activos de esa especialidad.
 *
 * Optimizado: solo busca el PRIMER slot disponible de cada médico
 * (no genera todos los slots), luego ordena y retorna el más cercano.
 * ============================================================================
 */

import { Result, Ok, Err } from '@clinica-x/shared-kernel';
import {
  MedicoNoEncontradoError,
  SlotNoDisponibleError,
} from '@/modules/citas/domain/exceptions/cita.errors';
import type {
  IObtenerSlotMasProximoPort,
  ObtenerSlotMasProximoDto,
  SlotMasProximoDto,
} from '@/modules/citas/domain/ports/in/citas.port';
import type { ICitaRepository } from '@/modules/citas/domain/ports/out/cita.repository.port';
import type {
  IMedicoConsultaPort,
  MedicoConsulta,
  HorarioConsulta,
} from '@/modules/citas/domain/ports/out/medico-consulta.port';
import {
  nowLima,
  addDaysLima,
  getLimaDayOfWeek,
  startOfDayLima,
  endOfDayLima,
  buildLimaDate,
  formatLima,
} from '@clinica-x/date-utils';

export class ObtenerSlotMasProximoUseCase implements IObtenerSlotMasProximoPort {
  constructor(
    private readonly repo: ICitaRepository,
    private readonly medicoReader: IMedicoConsultaPort,
  ) {}

  async execute(dto: ObtenerSlotMasProximoDto): Promise<Result<SlotMasProximoDto, Error>> {
    const medicos = await this.medicoReader.buscarPorEspecialidadActiva(dto.especialidadId);
    if (medicos.length === 0) {
      return Err(new MedicoNoEncontradoError());
    }

    const ahora = nowLima();
    const maxDias = 7;
    const diasSemanaSet = new Set<number>();
    for (let i = 0; i < maxDias; i++) {
      diasSemanaSet.add(getLimaDayOfWeek(addDaysLima(ahora, i)));
    }
    const diasSemana = Array.from(diasSemanaSet);
    const medicoIds = medicos.map((m) => m.id);

    // Batch queries para evitar N+1
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

    interface Candidato {
      slotDateTime: Date;
      medico: MedicoConsulta;
      horaInicio: Date;
      horaFin: Date;
    }

    const candidatos: Candidato[] = [];

    for (const medico of medicos) {
      const citasDelMedico = citasPorMedico.get(medico.id) ?? [];

      let encontrado = false;

      for (let diaOffset = 0; diaOffset < maxDias && !encontrado; diaOffset++) {
        const fecha = addDaysLima(ahora, diaOffset);
        const diaSemana = getLimaDayOfWeek(fecha);
        const key = `${medico.id}#${diaSemana}`;
        const horarios = horariosMap.get(key) ?? [];

        if (horarios.length === 0) continue;

        const inicioDia = startOfDayLima(fecha);
        const finDia = endOfDayLima(fecha);
        const citasDelDia = citasDelMedico.filter(
          (c) => c.fechaHora >= inicioDia && c.fechaHora <= finDia,
        );

        for (const h of horarios) {
          if (encontrado) break;

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
            if (diffMs > 0 && !this.estaOcupado(slotStart, slotEnd, citasDelDia, h.duracionSlot)) {
              candidatos.push({ slotDateTime, medico, horaInicio: slotStart, horaFin: slotEnd });
              encontrado = true;
              break;
            }

            slotStart = slotEnd;
          }
        }
      }
    }

    if (candidatos.length === 0) {
      return Err(
        new SlotNoDisponibleError(
          'No hay turnos disponibles para esta especialidad en los próximos días',
        ),
      );
    }

    // Análisis matemático: ordenar por fecha ascendente y tomar el más próximo
    candidatos.sort((a, b) => a.slotDateTime.getTime() - b.slotDateTime.getTime());
    const mejor = candidatos[0];

    return Ok({
      doctorId: mejor.medico.id,
      doctorName: mejor.medico.nombreUsuario,
      specialty: mejor.medico.especialidadNombre,
      fecha: formatLima(mejor.slotDateTime, 'yyyy-MM-dd'),
      horaInicio: formatLima(mejor.horaInicio, 'HH:mm'),
      horaFin: formatLima(mejor.horaFin, 'HH:mm'),
      slotDateTime: mejor.slotDateTime.toISOString(),
    });
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
