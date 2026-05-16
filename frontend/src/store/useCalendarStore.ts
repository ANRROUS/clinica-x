import { create } from 'zustand';

interface CalendarStore {
  view: 'mensual' | 'semanal' | 'diaria';
  currentDate: Date;
  setView: (v: 'mensual' | 'semanal' | 'diaria') => void;
  navigateNext: () => void;
  navigatePrev: () => void;
  goToDate: (date: Date) => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  view: 'semanal',
  currentDate: new Date(),
  setView: (v) => set({ view: v }),
  navigateNext: () =>
    set((state) => {
      const d = new Date(state.currentDate);
      if (state.view === 'mensual') d.setMonth(d.getMonth() + 1);
      else if (state.view === 'semanal') d.setDate(d.getDate() + 7);
      else d.setDate(d.getDate() + 1);
      return { currentDate: d };
    }),
  navigatePrev: () =>
    set((state) => {
      const d = new Date(state.currentDate);
      if (state.view === 'mensual') d.setMonth(d.getMonth() - 1);
      else if (state.view === 'semanal') d.setDate(d.getDate() - 7);
      else d.setDate(d.getDate() - 1);
      return { currentDate: d };
    }),
  goToDate: (date) => set({ currentDate: date }),
}));
