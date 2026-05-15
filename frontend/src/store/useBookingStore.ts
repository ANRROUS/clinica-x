import { create } from 'zustand';
import type { DisponibilidadDoctorDTO, SlotDTO } from '@/lib/api/types';

interface BookingStore {
  selectedSpecialtyId: string | null;
  selectedSpecialtyName: string | null;
  selectedDoctor: DisponibilidadDoctorDTO | null;
  selectedDate: string | null;
  selectedSlot: SlotDTO | null;
  bookingMode: 'manual' | 'automatic';
  prefillFromOrder: { specialtyId: string; analysisOrderId: string } | null;
  setSpecialty: (id: string, name: string) => void;
  setDoctor: (doctor: DisponibilidadDoctorDTO | null) => void;
  setDate: (date: string | null) => void;
  setSlot: (slot: SlotDTO | null) => void;
  setMode: (mode: 'manual' | 'automatic') => void;
  setPrefill: (prefill: { specialtyId: string; analysisOrderId: string } | null) => void;
  reset: () => void;
}

const initialState = {
  selectedSpecialtyId: null as string | null,
  selectedSpecialtyName: null as string | null,
  selectedDoctor: null as DisponibilidadDoctorDTO | null,
  selectedDate: null as string | null,
  selectedSlot: null as SlotDTO | null,
  bookingMode: 'manual' as 'manual' | 'automatic',
  prefillFromOrder: null as { specialtyId: string; analysisOrderId: string } | null,
};

export const useBookingStore = create<BookingStore>((set) => ({
  ...initialState,
  setSpecialty: (id, name) =>
    set({
      selectedSpecialtyId: id,
      selectedSpecialtyName: name,
      selectedDoctor: null,
      selectedDate: null,
      selectedSlot: null,
    }),
  setDoctor: (doctor) =>
    set({ selectedDoctor: doctor, selectedDate: null, selectedSlot: null }),
  setDate: (date) => set({ selectedDate: date, selectedSlot: null }),
  setSlot: (slot) => set({ selectedSlot: slot }),
  setMode: (mode) => set({ bookingMode: mode }),
  setPrefill: (prefill) => set({ prefillFromOrder: prefill }),
  reset: () => set(initialState),
}));