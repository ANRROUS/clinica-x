'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { getActivePatient, getDoctorPatients, getDoctorSlotDuration } from '@/lib/api/doctor.api';
import type { ConsultaMedicoDTO } from '@/lib/api/types';
import { parseApiDate, nowLima, getLimaYear, getLimaMonth, getLimaDay } from '@clinica-x/date-utils';

interface PatientSidebarProps {
  activeConsultation: ConsultaMedicoDTO | null;
  patients: ConsultaMedicoDTO[];
  onSelectPatient: (id: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function PatientSidebar({
  activeConsultation,
  patients,
  onSelectPatient,
  collapsed = false,
  onToggleCollapse,
}: PatientSidebarProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const { data: slotDurationData } = useQuery({
    queryKey: ['doctorSlotDuration'],
    queryFn: async () => {
      const res = await getDoctorSlotDuration();
      return res.success ? res.data?.duracionSlot : 30;
    },
    staleTime: Infinity,
    enabled: isAuthenticated,
  });
  const slotDuration = slotDurationData ?? 30;

  const validActiveConsultation = useMemo(() => {
    if (!activeConsultation) return null;
    const inicio = parseApiDate(activeConsultation.fechaInicio);
    const now = nowLima();
    const fin = new Date(inicio.getTime() + slotDuration * 60000);
    return now >= inicio && now <= fin ? activeConsultation : null;
  }, [activeConsultation, slotDuration]);

  const generalList = useMemo(() => {
    const unique = new Map<string, { id: string; name: string }>();
    patients.forEach((c) => {
      if (c.pacienteId && !unique.has(c.pacienteId)) {
        const name = `${c.pacienteNombre || ''} ${c.pacienteApellido || ''}`.trim() || 'Paciente';
        unique.set(c.pacienteId, { id: c.pacienteId, name });
      }
    });
    return Array.from(unique.values()).sort((a, b) => a.name.localeCompare(b.name, 'es'));
  }, [patients]);

  const patientsToday = patients.filter((c) => {
    const fecha = parseApiDate(c.fechaInicio);
    const today = nowLima();
    return (
      getLimaDay(fecha) === getLimaDay(today) &&
      getLimaMonth(fecha) === getLimaMonth(today) &&
      getLimaYear(fecha) === getLimaYear(today)
    );
  });

  const uniquePatientsToday = new Map<string, ConsultaMedicoDTO>();
  patientsToday.forEach((c) => {
    if (!uniquePatientsToday.has(c.pacienteId)) {
      uniquePatientsToday.set(c.pacienteId, c);
    }
  });

  const todayList = Array.from(uniquePatientsToday.values()).filter(
    (c) => c.pacienteId !== validActiveConsultation?.pacienteId
  );

  const currentPatientId = pathname.split('/').pop();

  if (collapsed) {
    return (
      <aside className="flex h-full w-14 flex-col items-center bg-brand-500 py-4">
        <button
          onClick={onToggleCollapse}
          className="mb-4 rounded-lg p-2 text-white hover:bg-brand-600"
          title="Expandir panel"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <button
          onClick={() => router.push('/doctor/pacientes')}
          className="mb-4 rounded-lg p-2 text-white hover:bg-brand-600"
          title="Pacientes"
        >
          <Users className="h-5 w-5" />
        </button>
        <div className="flex-1 space-y-2 overflow-y-auto">
          {validActiveConsultation && (
            <button
              onClick={() => router.push(`/doctor/pacientes/${validActiveConsultation.pacienteId}`)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-brand-500 hover:bg-gray-100"
              title={`${validActiveConsultation.pacienteNombre || ''} ${validActiveConsultation.pacienteApellido || ''}`}
            >
              {(validActiveConsultation.pacienteNombre?.[0] || '?').toUpperCase()}
            </button>
          )}
          {todayList.slice(0, 10).map((p) => {
            const initial = (p.pacienteNombre?.[0] || '?').toUpperCase();
            return (
              <button
                key={p.pacienteId}
                onClick={() => router.push(`/doctor/pacientes/${p.pacienteId}`)}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold hover:bg-gray-100 ${
                  currentPatientId === p.pacienteId ? 'bg-white text-brand-500' : 'bg-brand-400 text-white'
                }`}
                title={`${p.pacienteNombre || ''} ${p.pacienteApellido || ''}`}
              >
                {initial}
              </button>
            );
          })}
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-72 flex-col bg-brand-500">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-xs font-semibold uppercase text-white/90">Paciente</p>
        <button
          onClick={onToggleCollapse}
          className="rounded-lg p-1.5 text-white hover:bg-brand-600"
          title="Colapsar panel"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
      <p className="px-4 text-xs text-white/70">Actual</p>
      <div className="px-4 py-2">
          {validActiveConsultation ? (
          <button
            onClick={() => router.push(`/doctor/pacientes/${validActiveConsultation.pacienteId}`)}
            className={`flex items-center gap-3 w-full rounded-lg border-l-4 bg-white px-3 py-2.5 text-left transition-colors ${
              currentPatientId === validActiveConsultation.pacienteId
                ? 'border-white'
                : 'border-brand-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-white">
              {(validActiveConsultation.pacienteNombre?.[0] || '?').toUpperCase()}
            </div>
            <p className="text-sm font-medium text-gray-900 truncate">
              {validActiveConsultation.pacienteNombre
                ? `${validActiveConsultation.pacienteNombre} ${validActiveConsultation.pacienteApellido || ''}`.trim()
                : 'Paciente'}
            </p>
          </button>
        ) : (
          <div className="rounded-lg border border-dashed border-white/40 bg-white/10 px-3 py-3">
            <p className="text-center text-xs text-white/70">Sin paciente en atención</p>
          </div>
        )}
      </div>

      <div className="px-4 py-3">
        <p className="text-xs font-semibold uppercase text-white/90">De Hoy</p>
        {todayList.length > 0 ? (
          <div className="mt-2 space-y-1">
              {todayList.map((p) => (
              <button
                key={p.pacienteId}
                onClick={() => router.push(`/doctor/pacientes/${p.pacienteId}`)}
                className={`flex items-center gap-3 w-full rounded-lg border-l-4 bg-white px-3 py-2 text-left text-sm font-medium transition-colors ${
                  currentPatientId === p.pacienteId
                    ? 'border-white text-brand-500'
                    : 'border-brand-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-white">
                  {(p.pacienteNombre?.[0] || '?').toUpperCase()}
                </div>
                <span className="truncate">
                  {p.pacienteNombre
                    ? `${p.pacienteNombre} ${p.pacienteApellido || ''}`.trim()
                    : 'Paciente'}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-2">
            <p className="text-xs text-white/70">Sin más citas hoy</p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <p className="text-xs font-semibold uppercase text-white/90 mb-2">General</p>
        {generalList.length > 0 ? (
          <div className="space-y-1">
            {generalList.map((p) => (
              <button
                key={p.id}
                onClick={() => router.push(`/doctor/pacientes/${p.id}`)}
                className={`flex items-center gap-3 w-full rounded-lg border-l-4 bg-white px-3 py-2 text-left text-sm font-medium transition-colors ${
                  currentPatientId === p.id
                    ? 'border-white text-brand-500'
                    : 'border-brand-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-white">
                  {(p.name?.[0] || '?').toUpperCase()}
                </div>
                <span className="truncate">{p.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-white/40 bg-white/10 px-3 py-3 mt-2 flex flex-col items-center justify-center gap-2">
            <Users className="h-5 w-5 text-white/70" />
            <p className="text-center text-xs text-white/70">No hay pacientes registrados</p>
          </div>
        )}
      </div>
    </aside>
  );
}
