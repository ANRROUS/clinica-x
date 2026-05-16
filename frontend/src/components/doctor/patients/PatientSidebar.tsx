'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search, User } from 'lucide-react';
import { useDoctorAuthStore } from '@/store/useDoctorAuthStore';
import { getActivePatient, getDoctorPatients } from '@/lib/api/doctor.api';
import type { ConsultaMedicoDTO } from '@/lib/api/types';

interface PatientSidebarProps {
  activeConsultation: ConsultaMedicoDTO | null;
  patients: ConsultaMedicoDTO[];
  onSelectPatient: (id: string) => void;
}

export default function PatientSidebar({
  activeConsultation,
  patients,
  onSelectPatient,
}: PatientSidebarProps) {
  const { isAuthenticated } = useDoctorAuthStore();
  const router = useRouter();
  const pathname = usePathname();

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
    const fecha = new Date(c.fechaInicio + 'Z');
    const today = new Date();
    return (
      fecha.getDate() === today.getDate() &&
      fecha.getMonth() === today.getMonth() &&
      fecha.getFullYear() === today.getFullYear()
    );
  });

  const uniquePatientsToday = new Map<string, ConsultaMedicoDTO>();
  patientsToday.forEach((c) => {
    if (!uniquePatientsToday.has(c.pacienteId)) {
      uniquePatientsToday.set(c.pacienteId, c);
    }
  });

  const todayList = Array.from(uniquePatientsToday.values()).filter(
    (c) => c.pacienteId !== activeConsultation?.pacienteId
  );

  const currentPatientId = pathname.split('/').pop();

  return (
    <aside className="flex h-full w-72 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-4 py-3">
        <p className="text-xs font-semibold uppercase text-gray-500">Paciente</p>
        <p className="text-xs text-gray-400">Actual</p>
        {activeConsultation ? (
          <button
            onClick={() => router.push(`/doctor/pacientes/${activeConsultation.pacienteId}`)}
            className={`mt-2 w-full rounded-lg border-2 px-3 py-2.5 text-left transition-colors ${
              currentPatientId === activeConsultation.pacienteId
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 bg-white hover:border-indigo-300'
            }`}
          >
            <p className="text-sm font-medium text-gray-900">
              {activeConsultation.pacienteNombre || `Paciente ${activeConsultation.pacienteId.slice(0, 8)}`}
            </p>
          </button>
        ) : (
          <div className="mt-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-3">
            <p className="text-center text-xs text-gray-400">Sin paciente en atención</p>
          </div>
        )}
      </div>

      <div className="border-b border-gray-200 px-4 py-3">
        <p className="text-xs font-semibold uppercase text-gray-500">De Hoy</p>
        {todayList.length > 0 ? (
          <div className="mt-2 space-y-1">
            {todayList.map((p) => (
              <button
                key={p.pacienteId}
                onClick={() => router.push(`/doctor/pacientes/${p.pacienteId}`)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  currentPatientId === p.pacienteId
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {p.pacienteNombre || p.pacienteId?.slice(0, 8)}
                {p.pacienteApellido ? ` ${p.pacienteApellido}` : ''}
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-2">
            <p className="text-xs text-gray-400">Sin más citas hoy</p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <p className="text-xs font-semibold uppercase text-gray-500">General</p>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            placeholder="Ej. Juan Pérez"
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {searchQuery.trim() && (
          <div className="mt-2 space-y-1">
            {isSearching ? (
              <p className="py-2 text-center text-xs text-gray-400">Buscando...</p>
            ) : searchResults.length > 0 ? (
              searchResults.map((p) => (
                <button
                  key={p.pacienteId}
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    router.push(`/doctor/pacientes/${p.pacienteId}`);
                  }}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                    currentPatientId === p.pacienteId
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {p.pacienteNombre || ''} {p.pacienteApellido || ''}
                </button>
              ))
            ) : (
              <p className="py-2 text-center text-xs text-gray-400">
                No se encontraron pacientes con ese nombre
              </p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
