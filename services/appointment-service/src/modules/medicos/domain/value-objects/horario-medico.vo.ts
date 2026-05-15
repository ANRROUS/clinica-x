/**
 * ============================================================================
 * HorarioMedico — Value Object
 * ============================================================================
 * Representa un bloque de horario de atención de un médico.
 * Inmutable y comparable estructuralmente.
 * ============================================================================
 */

import { Result, Ok, Err, ValueObjectBase } from '@clinica-x/shared-kernel';
import type { DiaSemana } from '@clinica-x/shared-types';

export interface HorarioMedicoProps {
  diaSemana: DiaSemana;
  horaInicio: string; // "08:00"
  horaFin: string;    // "08:30"
  duracionSlot?: number; // minutos, default 30
}

export class HorarioMedico extends ValueObjectBase<HorarioMedicoProps> {
  private constructor(props: HorarioMedicoProps) {
    super({
      ...props,
      duracionSlot: props.duracionSlot ?? 30,
    });
  }

  static create(props: HorarioMedicoProps): Result<HorarioMedico, Error> {
    const horaRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!horaRegex.test(props.horaInicio)) {
      return Err(new Error(`Formato de horaInicio inválido: ${props.horaInicio}`));
    }
    if (!horaRegex.test(props.horaFin)) {
      return Err(new Error(`Formato de horaFin inválido: ${props.horaFin}`));
    }
    if (props.horaInicio >= props.horaFin) {
      return Err(new Error('horaInicio debe ser anterior a horaFin'));
    }
    if (props.diaSemana < 1 || props.diaSemana > 7) {
      return Err(new Error('diaSemana debe estar entre 1 (Lunes) y 7 (Domingo)'));
    }

    return Ok(new HorarioMedico(props));
  }

  get diaSemana(): DiaSemana { return this.value.diaSemana; }
  get horaInicio(): string { return this.value.horaInicio; }
  get horaFin(): string { return this.value.horaFin; }
  get duracionSlot(): number { return this.value.duracionSlot ?? 30; }

  /** Retorna true si este horario se solapa con otro en el mismo día. */
  seSolapaCon(otro: HorarioMedico): boolean {
    if (this.diaSemana !== otro.diaSemana) return false;
    return this.horaInicio < otro.horaFin && this.horaFin > otro.horaInicio;
  }
}
