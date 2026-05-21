import { create } from 'zustand';
import { nowLima, addDaysLima, addMonthsLima } from '@clinica-x/date-utils';

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
  currentDate: nowLima(),
  setView: (v) => set({ view: v }),
  navigateNext: () =>
    set((state) => {
      if (state.view === 'mensual') return { currentDate: addMonthsLima(state.currentDate, 1) };
      if (state.view === 'semanal') return { currentDate: addDaysLima(state.currentDate, 7) };
      return { currentDate: addDaysLima(state.currentDate, 1) };
    }),
  navigatePrev: () =>
    set((state) => {
      if (state.view === 'mensual') return { currentDate: addMonthsLima(state.currentDate, -1) };
      if (state.view === 'semanal') return { currentDate: addDaysLima(state.currentDate, -7) };
      return { currentDate: addDaysLima(state.currentDate, -1) };
    }),
  goToDate: (date) => set({ currentDate: date }),
}));
