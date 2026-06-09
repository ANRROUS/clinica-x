/**
 * ============================================================================
 * Caso de uso: ObtenerDisponibilidadPorEspecialidad
 * ============================================================================
 * Retorna disponibilidad para todos los médicos activos de una especialidad.
 * Optimizado con batch queries para evitar N+1 problemas.
 * ============================================================================
 */

import { Result, Ok } from '@clinica-x/shared-kernel';
import type {
  IObtenerDisponibilidadPorEspecialidadPort,
  ObtenerDisponibilidadPorEspecialidadDto,
  DisponibilidadDoctorDto,
  SlotDto,
} from '@/modules/citas/domain/ports/in/citas.port';
import type { IAuthServiceClient } from '@/modules/medicos/domain/ports/out/medico.repository.port';
import type { ICitaRepository } from '@/modules/citas/domain/ports/out/cita.repository.port';
import type { IMedicoConsultaPort } from '@/modules/citas/domain/ports/out/medico-consulta.port';
import { nowLima, addDaysLima, getLimaDayOfWeek, startOfDayLima, endOfDayLima, buildLimaDate, formatLima } from '@clinica-x/date-utils';

export class ObtenerDisponibilidadPorEspecialidadUseCase implements IObtenerDisponibilidadPorEspecialidadPort {
  constructor(
    private readonly repo: ICitaRepository,
    private readonly medicoReader: IMedicoConsultaPort,
    private readonly authClient: IAuthServiceClient,
  ) {}

  async execute(dto: ObtenerDisponibilidadPorEspecialidadDto): Promise<Result<DisponibilidadDoctorDto[], Error>> {
    const medicos = await this.medicoReader.buscarPorEspecialidadActiva(dto.especialidadId);
    if (medicos.length === 0) {
      return Ok([]);
    }

    const ahora = nowLima();

    const usuarioIds = Array.from(
      new Set(medicos.map((m) => m.usuarioId).filter(Boolean)),
    );
    let usuariosPorId = new Map<string, { id: string; nombre: string; apellido: string }>();

    if (usuarioIds.length > 0) {
      try {
        const usuarios = await this.authClient.obtenerUsuariosPorIds(usuarioIds);
        usuariosPorId = new Map(usuarios.map((u) => [u.id, u]));
      } catch {
        usuariosPorId = new Map();
      }
    }

    const fechaBase = dto.fechaDesde ?? nowLima();
    const diasAVerificar = 7;

    const diasSemanaSet = new Set<number>();
    for (let i = 0; i < diasAVerificar; i++) {
      const fecha = addDaysLima(fechaBase, i);
      diasSemanaSet.add(getLimaDayOfWeek(fecha));
    }
    const diasSemana = Array.from(diasSemanaSet);

    // 1. Batch query de horarios para todos los médicos y días de la semana
    const medicoIds = medicos.map((m) => m.id);
    const horariosMap = await this.medicoReader.listarHorariosPorMedicos(medicoIds, diasSemana);

    // 2. Batch query de citas para todos los médicos en el rango completo
    const inicioRango = startOfDayLima(fechaBase);
    const finRango = endOfDayLima(addDaysLima(fechaBase, diasAVerificar - 1));
    const todasLasCitas = await this.repo.buscarPorMedicosYFecha(medicoIds, inicioRango, finRango);

    // Indexar citas por medicoId para lookup O(1)
    const citasPorMedico = new Map<string, typeof todasLasCitas>();
    for (const cita of todasLasCitas) {
      const lista = citasPorMedico.get(cita.medicoId);
      if (lista) {
        lista.push(cita);
      } else {
        citasPorMedico.set(cita.medicoId, [cita]);
      }
    }

    const resultado: DisponibilidadDoctorDto[] = [];

    for (const medico of medicos) {
      const dias: { fecha: string; slots: SlotDto[] }[] = [];
      const citasDelMedico = citasPorMedico.get(medico.id) ?? [];

      for (let i = 0; i < diasAVerificar; i++) {
        const fecha = addDaysLima(fechaBase, i);
        const diaSemana = getLimaDayOfWeek(fecha);
        const key = `${medico.id}#${diaSemana}`;
        const horarios = horariosMap.get(key) ?? [];

        if (horarios.length === 0) continue;

        const inicioDia = startOfDayLima(fecha);
        const finDia = endOfDayLima(fecha);
        const citasDelDia = citasDelMedico.filter((c) => {
          return c.fechaHora >= inicioDia && c.fechaHora <= finDia;
        });

        const slots: SlotDto[] = [];
        for (const h of horarios) {
          let slotStart = this.parseTime(h.horaInicio, fecha);
          const slotEndMax = this.parseTime(h.horaFin, fecha);
          while (slotStart < slotEndMax) {
            const slotEnd = new Date(slotStart.getTime() + h.duracionSlot * 60 * 1000);
            if (slotEnd > slotEndMax) break;
            const enPasado = slotStart <= ahora;
            const disponible = !enPasado && !this.estaOcupado(slotStart, slotEnd, citasDelDia, h.duracionSlot);
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
        const user = usuariosPorId.get(medico.usuarioId);
        const doctorName = user ? `${user.nombre} ${user.apellido}` : medico.nombreUsuario;
        resultado.push({
          doctorId: medico.id,
          doctorName,
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
