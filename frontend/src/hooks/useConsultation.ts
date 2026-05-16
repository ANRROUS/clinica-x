'use client';

import { useConsultationStore } from '@/store/useConsultationStore';

export function useConsultation() {
  const store = useConsultationStore();

  return {
    consultationId: store.consultationId,
    diagnosis: store.diagnosis,
    analysisOrders: store.analysisOrders,
    medications: store.medications,
    isDirty: store.isDirty,
    setConsultationId: store.setConsultationId,
    setDiagnosis: store.setDiagnosis,
    addAnalysisOrder: store.addAnalysisOrder,
    removeAnalysisOrder: store.removeAnalysisOrder,
    addMedication: store.addMedication,
    removeMedication: store.removeMedication,
    reset: store.reset,
  };
}
