'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { CalendarX2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { getDoctorPatients, getActivePatient, getDoctorSlotDuration } from '@/lib/api/doctor.api';
import PatientSidebar from '@/components/doctor/patients/PatientSidebar';
import { nowLima, addMonthsLima, formatLima, parseApiDate } from '@clinica-x/date-utils';

export default function DoctorPacientesPage() {
  const { isAuthenticated } = useAuthStore();
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

  const { data: patientsData } = useQuery({
    queryKey: ['doctor-patients', dateRange],
    queryFn: () => getDoctorPatients(dateRange),
    enabled: isAuthenticated,
  });

  const { data: activeData, isLoading: isActiveLoading } = useQuery({
    queryKey: ['doctor-active-patient'],
    queryFn: getActivePatient,
    enabled: isAuthenticated,
  });

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

  const patients = patientsData?.data || [];
  const activeConsultation = activeData?.data || null;

  const isConsultationValid = (() => {
    if (!activeConsultation) return false;
    const inicio = parseApiDate(activeConsultation.fechaInicio);
    const now = nowLima();
    const fin = new Date(inicio.getTime() + slotDuration * 60000);
    return now >= inicio && now <= fin;
  })();

  useEffect(() => {
    if (mounted && isAuthenticated && isConsultationValid && activeConsultation) {
      router.replace(`/doctor/pacientes/${activeConsultation.pacienteId}`);
    }
  }, [mounted, isAuthenticated, isConsultationValid, activeConsultation, router]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/doctor/login');
    }
  }, [isAuthenticated, router]);

  if (!mounted || !isAuthenticated) {
    return <div className="flex h-full" />;
  }

  return (
    <div className="flex h-full w-full">
      <PatientSidebar
        activeConsultation={activeConsultation}
        patients={patients}
        onSelectPatient={(id) => router.push(`/doctor/pacientes/${id}`)}
      />

      <div className="flex flex-1 flex-col overflow-hidden bg-gray-50">
        {isActiveLoading || isConsultationValid ? (
          <div className="flex flex-1 items-center justify-center text-gray-400">
            Cargando consulta actual...
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 rounded-full bg-brand-50 p-4 text-brand-500">
              <CalendarX2 className="h-12 w-12" style={{ color: '#008585' }} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No tienes consultas actuales</h2>
            <p className="text-gray-500 max-w-sm">
              En este momento no cuentas con ninguna consulta en desarrollo. Selecciona un paciente del menú lateral para ver su historial o buscar otros pacientes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
