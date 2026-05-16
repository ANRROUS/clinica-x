'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDoctorAuthStore } from '@/store/useDoctorAuthStore';
import { getActivePatient, getDoctorPatients } from '@/lib/api/doctor.api';
import PatientSidebar from '@/components/doctor/patients/PatientSidebar';
import PatientSidebarCollapsed from '@/components/doctor/patients/PatientSidebarCollapsed';
import PatientHeader from '@/components/doctor/patients/PatientHeader';
import PatientTabs from '@/components/doctor/patients/PatientTabs';
import ActiveConsultation from '@/components/doctor/patients/consultation/ActiveConsultation';
import ConsultationHistory from '@/components/doctor/patients/history/ConsultationHistory';
import type { ConsultaMedicoDTO } from '@/lib/api/types';

export default function DoctorPatientDetailPage() {
  const { isAuthenticated } = useDoctorAuthStore();
  const router = useRouter();
  const params = useParams();
  const patientId = params.patientId as string;
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'historial' | 'consulta'>('historial');
  const [activeConsultation, setActiveConsultation] = useState<ConsultaMedicoDTO | null>(null);

  const { data: activeData } = useQuery({
    queryKey: ['doctor-active-patient'],
    queryFn: getActivePatient,
    enabled: isAuthenticated,
  });

  const dateRange = {
    desde: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().slice(0, 10),
    hasta: new Date().toISOString().slice(0, 10),
  };

  const { data: patientsData } = useQuery({
    queryKey: ['doctor-patients', dateRange],
    queryFn: () => getDoctorPatients(dateRange),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (activeData?.success && activeData.data) {
      const active = activeData.data;
      setActiveConsultation(active);
      if (active.pacienteId === patientId) {
        setActiveTab('consulta');
      }
    }
  }, [activeData, patientId]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/doctor/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

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
  };

  const content = (
    <div className="flex flex-1 flex-col overflow-hidden">
      {currentPatient && (
        <PatientHeader patientId={patientId} patientName={patientName} />
      )}

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
      <div className="hidden lg:block">
        <PatientSidebar {...sidebarProps} />
      </div>
      <div className="hidden md:block lg:hidden">
        <PatientSidebarCollapsed
          patients={patients}
          activeConsultation={activeConsultation}
        />
      </div>
      {content}
    </div>
  );
}
