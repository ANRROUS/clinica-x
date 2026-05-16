'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Stethoscope, FileText } from 'lucide-react';
import { startConsultation, finalizeConsultation } from '@/lib/api/doctor.api';
import DiagnosisForm from './DiagnosisForm';
import AnalysisOrderManager from './AnalysisOrderManager';
import MedicationTable from './MedicationTable';
import FinalizeConsultationModal from './FinalizeConsultationModal';
import type { ConsultaMedicoDTO } from '@/lib/api/types';
import type { AnalysisOrder, Medication } from '@/store/useConsultationStore';

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
  const [diagnosis, setDiagnosis] = useState('');
  const [analysisOrders, setAnalysisOrders] = useState<AnalysisOrder[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [starting, setStarting] = useState(false);

  const startMutation = useMutation({
    mutationFn: startConsultation,
    onSuccess: (res) => {
      if (res.success && res.data) {
        toast.success('Consulta iniciada');
        queryClient.invalidateQueries({ queryKey: ['doctor-active-patient'] });
      } else {
        toast.error(res.error?.mensaje || 'No se pudo iniciar la consulta');
      }
    },
    onError: () => toast.error('Error al iniciar consulta'),
  });

  const finalizeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { diagnostico: string; analysisOrders: AnalysisOrder[]; medications: Medication[] } }) =>
      finalizeConsultation(id, data),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Consulta finalizada correctamente');
        onConsultationFinalized();
      } else {
        toast.error(res.error?.mensaje || 'Error al finalizar consulta');
      }
    },
    onError: () => toast.error('Error al finalizar consulta'),
  });

  if (!consultation) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <Stethoscope className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Iniciar Consulta</h3>
          <p className="mt-1 text-sm text-gray-500">
            Paciente: {patientName || patientId}
          </p>
          <button
            onClick={() => {
              setStarting(true);
              startMutation.mutate({ pacienteId: patientId });
            }}
            disabled={startMutation.isPending}
            className="mt-6 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
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
        onAdd={(order) => setAnalysisOrders([...analysisOrders, order])}
        onRemove={(index) =>
          setAnalysisOrders(analysisOrders.filter((_, i) => i !== index))
        }
      />

      <MedicationTable
        medications={medications}
        onAdd={(med) => setMedications([...medications, med])}
        onRemove={(index) =>
          setMedications(medications.filter((_, i) => i !== index))
        }
      />

      <div className="flex justify-end">
        <button
          onClick={() => setShowFinalizeModal(true)}
          className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
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
            finalizeMutation.mutate({
              id: consultation.id,
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
