import { create } from 'zustand';

export interface AnalysisOrder {
  examName: string;
  specialty?: string;
}

export interface Medication {
  name: string;
  days: number;
  frequency: string;
}

interface ConsultationStore {
  consultationId: string | null;
  diagnosis: string;
  analysisOrders: AnalysisOrder[];
  medications: Medication[];
  isDirty: boolean;
  setConsultationId: (id: string) => void;
  setDiagnosis: (text: string) => void;
  addAnalysisOrder: (order: AnalysisOrder) => void;
  removeAnalysisOrder: (index: number) => void;
  addMedication: (med: Medication) => void;
  removeMedication: (index: number) => void;
  reset: () => void;
}

export const useConsultationStore = create<ConsultationStore>((set) => ({
  consultationId: null,
  diagnosis: '',
  analysisOrders: [],
  medications: [],
  isDirty: false,
  setConsultationId: (id) => set({ consultationId: id }),
  setDiagnosis: (text) => set({ diagnosis: text, isDirty: true }),
  addAnalysisOrder: (order) =>
    set((state) => ({
      analysisOrders: [...state.analysisOrders, order],
      isDirty: true,
    })),
  removeAnalysisOrder: (index) =>
    set((state) => ({
      analysisOrders: state.analysisOrders.filter((_, i) => i !== index),
      isDirty: true,
    })),
  addMedication: (med) =>
    set((state) => ({
      medications: [...state.medications, med],
      isDirty: true,
    })),
  removeMedication: (index) =>
    set((state) => ({
      medications: state.medications.filter((_, i) => i !== index),
      isDirty: true,
    })),
  reset: () =>
    set({
      consultationId: null,
      diagnosis: '',
      analysisOrders: [],
      medications: [],
      isDirty: false,
    }),
}));
