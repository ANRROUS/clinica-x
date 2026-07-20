'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDoctorAuthStore } from '@/store/useDoctorAuthStore';
import { getActivePatient, getDoctorCalendar, getDoctorSlotDuration } from '@/lib/api/doctor.api';
import PatientSidebar from '@/components/doctor/patients/PatientSidebar';
import PatientHeader from '@/components/doctor/patients/PatientHeader';
import PatientTabs from '@/components/doctor/patients/PatientTabs';
import ActiveConsultation from '@/components/doctor/patients/consultation/ActiveConsultation';
import ConsultationHistory from '@/components/doctor/patients/history/ConsultationHistory';
import { nowLima, addDaysLima, addYearsLima, formatLima, parseApiDate } from '@clinica-x/date-utils';

export default function DoctorPatientDetailPage() {
  const { isAuthenticated } = useDoctorAuthStore();
  const router = useRouter();
  const params = useParams();
  const patientId = params.patientId as string;
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'historial' | 'consulta'>('historial');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Actualizar 'now' cada segundo para que isActivePatient y el cronómetro sean en tiempo real
  const [now, setNow] = useState(nowLima);
  useEffect(() => {
    const interval = setInterval(() => setNow(nowLima()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: activeData, isLoading: isLoadingActive } = useQuery({
    queryKey: ['doctor-active-patient'],
    queryFn: getActivePatient,
    enabled: isAuthenticated,
  });

  const dateRange = useMemo(() => {
    const hoy = nowLima();
    return {
      desde: formatLima(addYearsLima(hoy, -1), 'yyyy-MM-dd'),
      hasta: formatLima(addDaysLima(hoy, 30), 'yyyy-MM-dd'),
    };
  }, []);

  const { data: citasData, isLoading: isLoadingCitas } = useQuery({
    queryKey: ['doctor-calendar', dateRange],
    queryFn: () => getDoctorCalendar(dateRange),
    enabled: isAuthenticated,
  });

  const { data: slotDurationData, isLoading: isLoadingSlot } = useQuery({
    queryKey: ['doctorSlotDuration'],
    queryFn: async () => {
      const res = await getDoctorSlotDuration();
      return res.success ? res.data?.duracionSlot : 30;
    },
    staleTime: Infinity,
    enabled: isAuthenticated,
  });
  const slotDuration = slotDurationData ?? 30;

  // Consulta activa del backend solo si está dentro del slot de tiempo
  const activeConsultation = (() => {
    if (!activeData?.success || !activeData.data) return null;
    const active = activeData.data;
    const inicio = parseApiDate(active.fechaInicio);
    const appointmentEnd = new Date(inicio.getTime() + slotDuration * 60000);
    if (now >= inicio && now <= appointmentEnd) {
      return active;
    }
    return null;
  })();

  // Filtrar citas completadas para no mostrarlas como activas
  const citas = (citasData?.data || []).filter((c) => c.estado !== 'COMPLETADA');
  const currentCita = citas.find((c) => c.pacienteId === patientId);

  // El paciente es "activo" si su cita actual está dentro del slot de tiempo
  const isActivePatient = (() => {
    if (!currentCita || !slotDuration) return false;
    const inicio = parseApiDate(currentCita.fechaHora);
    const fin = new Date(inicio.getTime() + slotDuration * 60000);
    return now >= inicio && now <= fin;
  })();

  // Auto-abrir tab de consulta cuando se activa el paciente
  useEffect(() => {
    if (isActivePatient) {
      setActiveTab('consulta');
    }
  }, [isActivePatient]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/doctor/login');
    }
  }, [isAuthenticated, router]);

  if (!mounted || !isAuthenticated) {
    return <div className="flex h-full" />;
  }

  const patientName = currentCita
    ? `${currentCita.pacienteNombre || ''} ${currentCita.pacienteApellido || ''}`.trim()
    : `Paciente ${patientId.slice(0, 8)}...`;

  const isLoading = isLoadingActive || isLoadingCitas || isLoadingSlot;

  const sidebarProps = {
    citas,
    slotDuration,
    onSelectPatient: (id: string) => router.push(`/doctor/pacientes/${id}`),
    collapsed: sidebarCollapsed,
    onToggleCollapse: () => setSidebarCollapsed((prev) => !prev),
    isLoading,
  };

  const content = (
    <div className="flex flex-1 flex-col overflow-hidden">
      <PatientHeader
        patientId={patientId}
        patientName={patientName}
        isActivePatient={isActivePatient}
        fechaHora={currentCita?.fechaHora}
        slotDuration={slotDuration}
        isLoading={isLoading}
      />

      <PatientTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isActivePatient={isActivePatient}
        isLoading={isLoading}
      />

      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        {activeTab === 'consulta' && isActivePatient ? (
          <ActiveConsultation
            consultation={activeConsultation}
            patientId={patientId}
            patientName={patientName || undefined}
            onConsultationFinalized={() => {
              setActiveTab('historial');
              queryClient.invalidateQueries({ queryKey: ['doctor-active-patient'] });
              queryClient.invalidateQueries({ queryKey: ['doctor-calendar'] });
            }}
            isLoading={isLoading}
          />
        ) : (
          <ConsultationHistory
            patientId={patientId}
            isActivePatient={isActivePatient}
            consultationId={activeConsultation?.id || undefined}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-full">
      <PatientSidebar {...sidebarProps} />
      {content}
    </div>
  );
}
