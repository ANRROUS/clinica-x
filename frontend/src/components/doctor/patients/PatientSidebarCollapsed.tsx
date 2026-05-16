'use client';

import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import type { ConsultaMedicoDTO } from '@/lib/api/types';

interface PatientSidebarCollapsedProps {
  patients: ConsultaMedicoDTO[];
  activeConsultation: ConsultaMedicoDTO | null;
}

export default function PatientSidebarCollapsed({
  patients,
  activeConsultation,
}: PatientSidebarCollapsedProps) {
  const router = useRouter();

  const uniquePatients = new Map<string, ConsultaMedicoDTO>();
  if (activeConsultation) {
    uniquePatients.set(activeConsultation.pacienteId, activeConsultation);
  }
  patients.forEach((c) => {
    if (!uniquePatients.has(c.pacienteId)) {
      uniquePatients.set(c.pacienteId, c);
    }
  });

  return (
    <aside className="flex h-full w-14 flex-col items-center border-r border-gray-200 bg-white py-4">
      <button
        onClick={() => {
          router.push('/doctor/pacientes');
        }}
        className="mb-4 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        title="Buscar pacientes"
      >
        <Search className="h-5 w-5" />
      </button>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {Array.from(uniquePatients.values())
          .slice(0, 15)
          .map((p) => {
            const initial = (p.pacienteNombre?.[0] || '?').toUpperCase();
            return (
              <button
                key={p.pacienteId}
                onClick={() => router.push(`/doctor/pacientes/${p.pacienteId}`)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 hover:bg-indigo-200"
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
