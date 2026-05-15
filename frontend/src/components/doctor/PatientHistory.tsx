'use client';

import { useState } from 'react';
import { Clock, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import type { ConsultaMedicoDTO } from '@/lib/api/types';

interface PatientHistoryProps {
  patients: ConsultaMedicoDTO[];
  onViewConsultation: (id: string) => void;
}

const statusColors: Record<string, string> = {
  ACTIVA: 'bg-amber-100 text-amber-800',
  FINALIZADA: 'bg-green-100 text-green-800',
};

const statusLabels: Record<string, string> = {
  ACTIVA: 'Activa',
  FINALIZADA: 'Finalizada',
};

function groupByPatient(consultas: ConsultaMedicoDTO[]) {
  const map = new Map<string, { nombre: string; consultas: ConsultaMedicoDTO[] }>();
  consultas.forEach((c) => {
    const key = c.pacienteId;
    if (!map.has(key)) {
      map.set(key, { nombre: c.pacienteNombre || c.pacienteId, consultas: [] });
    }
    map.get(key)!.consultas.push(c);
  });
  return Array.from(map.values()).sort((a, b) => b.consultas.length - a.consultas.length);
}

export default function PatientHistory({ patients, onViewConsultation }: PatientHistoryProps) {
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null);
  const grouped = groupByPatient(patients);

  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <FileText className="mb-3 h-12 w-12" />
        <p className="text-lg font-medium">Sin pacientes en el período seleccionado</p>
        <p className="text-sm">Ajusta el rango de fechas para ver el historial</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {grouped.map(({ nombre, consultas }) => {
        const isExpanded = expandedPatient === nombre;
        return (
          <div key={nombre} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <button
              onClick={() => setExpandedPatient(isExpanded ? null : nombre)}
              className="flex w-full items-center justify-between px-4 py-3 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                  {nombre.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{nombre}</p>
                  <p className="text-xs text-gray-500">
                    {consultas.length} consulta{consultas.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
            </button>

            {isExpanded && (
              <div className="border-t border-gray-100 px-4 pb-3">
                {consultas.map((c) => {
                  const fecha = new Date(c.fechaInicio + 'Z');
                  const dateStr = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
                  const timeStr = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div
                      key={c.id}
                      className="mt-2 flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{dateStr} — {timeStr}</p>
                          {c.diagnostico && (
                            <p className="max-w-[200px] truncate text-xs text-gray-500">{c.diagnostico}</p>
                          )}
                          {c.motivoConsulta && !c.diagnostico && (
                            <p className="max-w-[200px] truncate text-xs text-gray-500">{c.motivoConsulta}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[c.estado] || 'bg-gray-100 text-gray-600'}`}>
                          {statusLabels[c.estado] || c.estado}
                        </span>
                        <button
                          onClick={() => onViewConsultation(c.id)}
                          className="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
                        >
                          Ver
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}