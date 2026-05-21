'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useDoctorAuthStore } from '@/store/useDoctorAuthStore';
import { getDoctorPatients, getActivePatient } from '@/lib/api/doctor.api';
import PatientSidebar from '@/components/doctor/patients/PatientSidebar';
import PatientHistory from '@/components/doctor/PatientHistory';
import { nowLima, addMonthsLima, formatLima } from '@clinica-x/date-utils';

export default function DoctorPacientesPage() {
  const { isAuthenticated } = useDoctorAuthStore();
  const router = useRouter();
  const [dateRange, setDateRange] = useState(() => {
    const hasta = nowLima();
    const desde = addMonthsLima(hasta, -1);
    return {
      desde: formatLima(desde, 'yyyy-MM-dd'),
      hasta: formatLima(hasta, 'yyyy-MM-dd'),
    };
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: patientsData, isLoading } = useQuery({
    queryKey: ['doctor-patients', dateRange],
    queryFn: () => getDoctorPatients(dateRange),
    enabled: isAuthenticated,
  });

  const { data: activeData } = useQuery({
    queryKey: ['doctor-active-patient'],
    queryFn: getActivePatient,
    enabled: isAuthenticated,
  });

  const patients = patientsData?.data || [];
  const activeConsultation = activeData?.data || null;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/doctor/login');
    }
  }, [isAuthenticated, router]);

  if (!mounted || !isAuthenticated) {
    return <div className="flex h-full" />;
  }

  return (
    <div className="flex h-full">
      <PatientSidebar
        activeConsultation={activeConsultation}
        patients={patients}
        onSelectPatient={(id) => router.push(`/doctor/pacientes/${id}`)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900">Mis Pacientes</h1>
          <p className="text-sm text-gray-500">
            Selecciona un paciente del panel lateral para ver su historial
          </p>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {activeConsultation && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-200 text-sm font-bold text-amber-800">
                  {activeConsultation.pacienteNombre?.[0] || '?'}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-amber-900">
                    Consulta activa: {activeConsultation.pacienteNombre || 'Paciente'}
                  </p>
                  <p className="text-xs text-amber-700">
                    {activeConsultation.motivoConsulta || 'Sin motivo registrado'}
                  </p>
                </div>
                <button
                  onClick={() =>
                    router.push(`/doctor/pacientes/${activeConsultation.pacienteId}`)
                  }
                  className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700"
                >
                  Ir a consulta
                </button>
              </div>
            </div>
          )}

          <div className="mb-4 flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Desde</label>
              <input
                type="date"
                value={dateRange.desde}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, desde: e.target.value }))
                }
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Hasta</label>
              <input
                type="date"
                value={dateRange.hasta}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, hasta: e.target.value }))
                }
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={() => {
                const hasta = nowLima();
                const desde = addMonthsLima(hasta, -1);
                setDateRange({
                  desde: formatLima(desde, 'yyyy-MM-dd'),
                  hasta: formatLima(hasta, 'yyyy-MM-dd'),
                });
              }}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Último mes
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16 text-gray-400">Cargando pacientes...</div>
          ) : (
            <PatientHistory
              patients={patients}
              onViewConsultation={(id) => router.push(`/doctor/pacientes/${id}`)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
