'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDoctorAuthStore } from '@/store/useDoctorAuthStore';
import { getDoctorPatients } from '@/lib/api/doctor.api';
import ConsultationList from './ConsultationList';
import ConsultationDetail from './ConsultationDetail';
import AIChat from './AIChat';

interface ConsultationHistoryProps {
  patientId: string;
}

export default function ConsultationHistory({ patientId }: ConsultationHistoryProps) {
  const { isAuthenticated } = useDoctorAuthStore();
  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(null);

  const dateRange = {
    desde: new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toISOString().slice(0, 10),
    hasta: new Date().toISOString().slice(0, 10),
  };

  const { data: patientsData, isLoading } = useQuery({
    queryKey: ['doctor-patients', dateRange],
    queryFn: () => getDoctorPatients(dateRange),
    enabled: isAuthenticated,
  });

  const patients = patientsData?.data || [];
  const patientConsultations = patients.filter((c) => c.pacienteId === patientId);

  return (
    <div className="flex h-full gap-6">
      <div className="w-72 shrink-0">
        <ConsultationList
          consultations={patientConsultations}
          selectedId={selectedConsultationId}
          onSelect={(id) => setSelectedConsultationId(id)}
          isLoading={isLoading}
        />
      </div>

      <div className="flex-1">
        {selectedConsultationId ? (
          <ConsultationDetail
            consultationId={selectedConsultationId}
            onBack={() => setSelectedConsultationId(null)}
          />
        ) : (
          <AIChat patientId={patientId} />
        )}
      </div>
    </div>
  );
}
