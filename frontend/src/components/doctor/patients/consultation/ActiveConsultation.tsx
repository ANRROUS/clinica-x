'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Stethoscope } from 'lucide-react';
import { startConsultation, finalizeConsultation } from '@/lib/api/doctor.api';
import { getErrorMessage } from '@/lib/api/error-utils';
import DiagnosisForm from './DiagnosisForm';
import AnalysisOrderManager from './AnalysisOrderManager';
import MedicationTable from './MedicationTable';
import FinalizeConsultationModal from './FinalizeConsultationModal';
import { useConsultationStore } from '@/store/useConsultationStore';
import type { ConsultaMedicoDTO } from '@/lib/api/types';

interface ActiveConsultationProps {
  consultation: ConsultaMedicoDTO | null;
  patientId: string;
  patientName?: string;
  onConsultationFinalized: () => void;
}

export default function ActiveConsultation({
  consultation,
  patientId,
  patientName,
  onConsultationFinalized,
}: ActiveConsultationProps) {
  const queryClient = useQueryClient();
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);

  const {
    consultationId: storedConsultationId,
    diagnosis,
    analysisOrders,
    medications,
    setConsultationId,
    setDiagnosis,
    addAnalysisOrder,
    removeAnalysisOrder,
    addMedication,
    removeMedication,
    reset: resetStore,
  } = useConsultationStore();

  // Sincronizar el store cuando cambia la consulta activa
  useEffect(() => {
    if (consultation && storedConsultationId !== consultation.id) {
      resetStore();
      setConsultationId(consultation.id);
    }
  }, [consultation, storedConsultationId, setConsultationId, resetStore]);

  const startMutation = useMutation({
    mutationFn: startConsultation,
    onSuccess: (res) => {
      if (res.success && res.data) {
        toast.success('Consulta iniciada');
        setConsultationId(res.data.id);
        queryClient.invalidateQueries({ queryKey: ['doctor-active-patient'] });
      } else {
        toast.error(res.error?.mensaje || 'No se pudo iniciar la consulta');
      }
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const finalizeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { diagnostico: string; analysisOrders: typeof analysisOrders; medications: typeof medications } }) =>
      finalizeConsultation(id, data),
    onSuccess: () => {
      toast.success('Consulta finalizada correctamente');
      resetStore();
      onConsultationFinalized();
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  if (!consultation) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
            <Stethoscope className="h-8 w-8 text-brand-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Iniciar Consulta</h3>
          <p className="mt-1 text-sm text-gray-500">
            Paciente: {patientName || patientId}
          </p>
          <button
            onClick={() => {
              startMutation.mutate({ pacienteId: patientId });
            }}
            disabled={startMutation.isPending}
            className="mt-6 rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
          >
            {startMutation.isPending ? 'Iniciando...' : 'Iniciar Consulta'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DiagnosisForm value={diagnosis} onChange={setDiagnosis} />

      <AnalysisOrderManager
        orders={analysisOrders}
        onAdd={addAnalysisOrder}
        onRemove={removeAnalysisOrder}
      />

      <MedicationTable
        medications={medications}
        onAdd={addMedication}
        onRemove={removeMedication}
      />

      <div className="flex justify-end">
        <button
          onClick={() => setShowFinalizeModal(true)}
          className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Finalizar Consulta →
        </button>
      </div>

      {showFinalizeModal && (
        <FinalizeConsultationModal
          onConfirm={() => {
            if (!diagnosis.trim()) {
              toast.error('El diagnóstico no puede estar vacío');
              return;
            }
            const activeId = consultation.id;
            finalizeMutation.mutate({
              id: activeId,
              data: { diagnostico: diagnosis, analysisOrders, medications },
            });
            setShowFinalizeModal(false);
          }}
          onCancel={() => setShowFinalizeModal(false)}
          loading={finalizeMutation.isPending}
        />
      )}
    </div>
  );
}
