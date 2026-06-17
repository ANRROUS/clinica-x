'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDoctorAuthStore } from '@/store/useDoctorAuthStore';
import { getDoctorPatients } from '@/lib/api/doctor.api';
import AIChat from '@/components/doctor/patients/history/AIChat';
import { nowLima, addYearsLima, formatLima } from '@clinica-x/date-utils';
import { parseApiDate } from '@/lib/date-utils';
import { Bot, Users, ChevronLeft } from 'lucide-react';

export default function IATestPage() {
  const { isAuthenticated } = useDoctorAuthStore();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatientName, setSelectedPatientName] = useState<string>('');

  const hoy = nowLima();
  const dateRange = {
    desde: formatLima(addYearsLima(hoy, -2), 'yyyy-MM-dd'),
    hasta: formatLima(hoy, 'yyyy-MM-dd'),
  };

  const { data: patientsData, isLoading } = useQuery({
    queryKey: ['doctor-patients', dateRange],
    queryFn: () => getDoctorPatients(dateRange),
    enabled: isAuthenticated,
  });

  const patients = patientsData?.data || [];

  // Deduplicar pacientes por pacienteId
  const uniquePatients = useMemo(() => {
    const map = new Map<string, { id: string; name: string; lastDate: string }>();
    patients.forEach((c) => {
      if (!c.pacienteId) return;
      const name = `${c.pacienteNombre || ''} ${c.pacienteApellido || ''}`.trim() || 'Paciente';
      const existing = map.get(c.pacienteId);
      if (!existing || parseApiDate(c.fechaInicio).getTime() > parseApiDate(existing.lastDate).getTime()) {
        map.set(c.pacienteId, { id: c.pacienteId, name, lastDate: c.fechaInicio });
      }
    });
    return Array.from(map.values()).sort((a, b) => {
      return parseApiDate(b.lastDate).getTime() - parseApiDate(a.lastDate).getTime();
    });
  }, [patients]);

  const lastConsultation = useMemo(() => {
    if (!selectedPatientId || !patients.length) return null;
    const patientConsultations = patients
      .filter((c) => c.pacienteId === selectedPatientId && c.estado === 'FINALIZADA')
      .sort((a, b) => parseApiDate(b.fechaInicio).getTime() - parseApiDate(a.fechaInicio).getTime());
    return patientConsultations[0] || null;
  }, [patients, selectedPatientId]);

  return (
    <div className="flex h-full">
      {/* Sidebar con lista de pacientes */}
      <aside className="flex h-full w-72 flex-col bg-brand-500 border-r border-brand-600">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-white" />
            <p className="text-xs font-semibold uppercase text-white/90">IA - Test</p>
          </div>
        </div>
        <div className="px-4 pb-2">
          <p className="text-xs text-white/70">Selecciona un paciente para chatear</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <p className="text-xs font-semibold uppercase text-white/90 mb-2">Pacientes</p>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 rounded-lg bg-white/10 animate-pulse" />
              ))}
            </div>
          ) : uniquePatients.length > 0 ? (
            <div className="space-y-1">
              {uniquePatients.map((p) => {
                const isSelected = selectedPatientId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPatientId(p.id);
                      setSelectedPatientName(p.name);
                    }}
                    className={`flex items-center gap-3 w-full rounded-lg border-l-4 px-3 py-2 text-left text-sm font-medium transition-colors ${
                      isSelected
                        ? 'border-white bg-white text-brand-500'
                        : 'border-brand-300 bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${isSelected ? 'bg-brand-500' : 'bg-brand-300'}`}>
                      {(p.name?.[0] || '?').toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="truncate block">{p.name}</span>
                      <span className="text-xs text-white/60">
                        Última: {formatLima(parseApiDate(p.lastDate), 'dd/MM/yyyy')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-white/40 bg-white/10 px-3 py-6 mt-2 flex flex-col items-center justify-center gap-2">
              <Users className="h-5 w-5 text-white/70" />
              <p className="text-center text-xs text-white/70">No hay pacientes registrados</p>
            </div>
          )}
        </div>
      </aside>

      {/* Área principal con AIChat */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        {selectedPatientId ? (
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedPatientId(null);
                  setSelectedPatientName('');
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Volver a pacientes
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {selectedPatientName}
                </h1>
                <p className="text-xs text-gray-500">
                  Chat con Agente X — sin consulta activa
                </p>
              </div>
            </div>
            <AIChat
              patientId={selectedPatientId}
              patientName={selectedPatientName}
              lastConsultation={lastConsultation}
            />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
              <Bot className="h-8 w-8 text-brand-500" />
            </div>
            <h2 className="mb-1 text-lg font-bold text-gray-900">Agente X — Modo Test</h2>
            <p className="max-w-md text-sm text-gray-500">
              Selecciona un paciente del panel lateral para interactuar con el asistente de IA sin necesidad de una consulta activa.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
