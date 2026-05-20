'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDoctorAuthStore } from '@/store/useDoctorAuthStore';
import { getActivePatient, getDoctorPatients } from '@/lib/api/doctor.api';
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
  const { isAuthenticated } = useDoctorAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const validActiveConsultation = useMemo(() => {
    if (!activeConsultation) return null;
    const inicio = parseApiDate(activeConsultation.fechaInicio);
    const now = nowLima();
    const fin = new Date(inicio.getTime() + 60 * 60000);
    return now >= inicio && now <= fin ? activeConsultation : null;
  }, [activeConsultation]);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ConsultaMedicoDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(
    (query: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      debounceRef.current = setTimeout(() => {
        getDoctorPatients()
          .then((res) => {
            if (res.success && res.data) {
              const q = query.toLowerCase();
              const filtered = res.data.filter(
                (c) =>
                  c.pacienteNombre?.toLowerCase().includes(q) ||
                  c.pacienteApellido?.toLowerCase().includes(q)
              );
              const unique = new Map<string, ConsultaMedicoDTO>();
              filtered.forEach((c) => {
                if (!unique.has(c.pacienteId)) unique.set(c.pacienteId, c);
              });
              setSearchResults(Array.from(unique.values()).slice(0, 10));
            }
          })
          .finally(() => setIsSearching(false));
      }, 300);
    },
    []
  );

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
          title="Buscar pacientes"
        >
          <Search className="h-5 w-5" />
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
        <p className="text-xs font-semibold uppercase text-white/90">General</p>
        <div className="relative mt-2 border-b border-white/40">
          <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            placeholder="Ej. Juan Pérez"
            className="w-full bg-transparent py-2 pl-7 pr-3 text-sm text-white placeholder-white/60 focus:outline-none"
          />
        </div>

        {searchQuery.trim() && (
          <div className="mt-2 space-y-1">
            {isSearching ? (
              <p className="py-2 text-center text-xs text-white/70">Buscando...</p>
            ) : searchResults.length > 0 ? (
              searchResults.map((p) => (
                <button
                  key={p.pacienteId}
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    router.push(`/doctor/pacientes/${p.pacienteId}`);
                  }}
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
              ))
            ) : (
              <p className="py-2 text-center text-xs text-white/70">
                No se encontraron pacientes con ese nombre
              </p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
