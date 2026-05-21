'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDoctorAuthStore } from '@/store/useDoctorAuthStore';
import { getActivePatient, getDoctorPatients } from '@/lib/api/doctor.api';
import PatientSidebar from '@/components/doctor/patients/PatientSidebar';
import PatientHeader from '@/components/doctor/patients/PatientHeader';
import PatientTabs from '@/components/doctor/patients/PatientTabs';
import ActiveConsultation from '@/components/doctor/patients/consultation/ActiveConsultation';
import ConsultationHistory from '@/components/doctor/patients/history/ConsultationHistory';
import type { ConsultaMedicoDTO } from '@/lib/api/types';
import { nowLima, addMonthsLima, formatLima } from '@clinica-x/date-utils';
import { parseApiDate } from '@/lib/date-utils';

export default function DoctorPatientDetailPage() {
  const { isAuthenticated } = useDoctorAuthStore();
  const router = useRouter();
  const params = useParams();
  const patientId = params.patientId as string;
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'historial' | 'consulta'>('historial');
  const [activeConsultation, setActiveConsultation] = useState<ConsultaMedicoDTO | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: activeData } = useQuery({
    queryKey: ['doctor-active-patient'],
    queryFn: getActivePatient,
    enabled: isAuthenticated,
  });

  const searchParams = useSearchParams();
  const fromParam = searchParams.get('from');

  const dateRange = useMemo(() => {
    const hoy = nowLima();
    let desde = addMonthsLima(hoy, -3);
    if (fromParam) {
      const fromDate = new Date(fromParam + 'T00:00:00');
      if (!isNaN(fromDate.getTime()) && fromDate < desde) {
        desde = fromDate;
      }
    }
    return {
      desde: formatLima(desde, 'yyyy-MM-dd'),
      hasta: formatLima(hoy, 'yyyy-MM-dd'),
    };
  }, [fromParam]);

  const { data: patientsData } = useQuery({
    queryKey: ['doctor-patients', dateRange],
    queryFn: () => getDoctorPatients(dateRange),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (activeData?.success && activeData.data) {
      const active = activeData.data;
      const inicio = parseApiDate(active.fechaInicio);
      const now = nowLima();
      const appointmentEnd = new Date(inicio.getTime() + 60 * 60000);
      if (now >= inicio && now <= appointmentEnd) {
        setActiveConsultation(active);
        if (active.pacienteId === patientId) {
          setActiveTab('consulta');
        }
      }
    }
  }, [activeData, patientId]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/doctor/login');
    }
  }, [isAuthenticated, router]);

  if (!mounted || !isAuthenticated) {
    return <div className="flex h-full" />;
  }

  const patients = patientsData?.data || [];
  const currentPatient = patients.find((c) => c.pacienteId === patientId);

  const isActivePatient = activeConsultation?.pacienteId === patientId;

  const patientName = currentPatient
    ? `${currentPatient.pacienteNombre || ''} ${currentPatient.pacienteApellido || ''}`.trim()
    : `Paciente ${patientId.slice(0, 8)}...`;

  const sidebarProps = {
    activeConsultation,
    patients,
    onSelectPatient: (id: string) => router.push(`/doctor/pacientes/${id}`),
    collapsed: sidebarCollapsed,
    onToggleCollapse: () => setSidebarCollapsed((prev) => !prev),
  };

  const content = (
    <div className="flex flex-1 flex-col overflow-hidden">
      <PatientHeader patientId={patientId} patientName={patientName} />

      <PatientTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isActivePatient={isActivePatient}
      />

      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        {activeTab === 'consulta' && isActivePatient ? (
          <ActiveConsultation
            consultation={activeConsultation}
            patientId={patientId}
            patientName={patientName || undefined}
            onConsultationFinalized={() => {
              setActiveConsultation(null);
              setActiveTab('historial');
              queryClient.invalidateQueries({ queryKey: ['doctor-active-patient'] });
              queryClient.invalidateQueries({ queryKey: ['doctor-calendar'] });
            }}
          />
        ) : (
          <ConsultationHistory patientId={patientId} />
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
