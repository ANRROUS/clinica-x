'use client';

import { Plus, Trash2 } from 'lucide-react';

const diasSemana = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 7, label: 'Domingo' },
];

export interface HorarioEntry {
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
}

interface ScheduleGridProps {
  schedules: HorarioEntry[];
  onChange: (schedules: HorarioEntry[]) => void;
  errors?: string;
}

export default function ScheduleGrid({ schedules, onChange, errors }: ScheduleGridProps) {
  const addRow = () => {
    onChange([...schedules, { diaSemana: 1, horaInicio: '08:00', horaFin: '12:00' }]);
  };

  const removeRow = (index: number) => {
    onChange(schedules.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof HorarioEntry, value: string | number) => {
    const updated = [...schedules];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Horarios <span className="text-red-500">*</span>
        </label>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
        >
          <Plus className="h-3.5 w-3.5" />
          Agregar horario
        </button>
      </div>

      {schedules.length === 0 && (
        <p className="text-sm text-gray-400">
          No hay horarios definidos. Agrega al menos un horario.
        </p>
      )}

      <div className="space-y-2">
        {schedules.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <select
              value={s.diaSemana}
              onChange={(e) => updateRow(i, 'diaSemana', Number(e.target.value))}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {diasSemana.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>

            <input
              type="time"
              value={s.horaInicio}
              onChange={(e) => updateRow(i, 'horaInicio', e.target.value)}
              className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />

            <span className="text-sm text-gray-400">a</span>

            <input
              type="time"
              value={s.horaFin}
              onChange={(e) => updateRow(i, 'horaFin', e.target.value)}
              className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />

            <button
              type="button"
              onClick={() => removeRow(i)}
              className="rounded p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {errors && <p className="text-xs text-red-500">{errors}</p>}
    </div>
  );
}