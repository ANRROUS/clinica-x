'use client';

import { useCalendarStore } from '@/store/useCalendarStore';

export function useDoctorCalendar() {
  const { view, currentDate, setView, navigateNext, navigatePrev, goToDate } =
    useCalendarStore();

  return {
    view,
    currentDate,
    setView,
    navigateNext,
    navigatePrev,
    goToDate,
  };
}
