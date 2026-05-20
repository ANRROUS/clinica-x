'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CalendarMonth from './CalendarMonth';
import CalendarWeek from './CalendarWeek';
import CalendarDay from './CalendarDay';
import type { CitaCalendarioDTO } from '@/lib/api/types';
import {
  nowLima,
  addDaysLima,
  addMonthsLima,
  getLimaYear,
  getLimaMonth,
  getLimaDay,
  getLimaDayOfWeek,
  formatLima,
} from '@clinica-x/date-utils';

type ViewMode = 'mensual' | 'semanal' | 'diaria';

interface DoctorCalendarProps {
  citas: CitaCalendarioDTO[];
  onNavigateToPatient: (patientId: string) => void;
  loading?: boolean;
}

export default function DoctorCalendar({ citas, onNavigateToPatient, loading }: DoctorCalendarProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('semanal');
  const [currentDate, setCurrentDate] = useState(nowLima());

  const navigatePrev = () => {
    setCurrentDate((prev) => {
      if (viewMode === 'mensual') return addMonthsLima(prev, -1);
      if (viewMode === 'semanal') return addDaysLima(prev, -7);
      return addDaysLima(prev, -1);
    });
  };

  const navigateNext = () => {
    setCurrentDate((prev) => {
      if (viewMode === 'mensual') return addMonthsLima(prev, 1);
      if (viewMode === 'semanal') return addDaysLima(prev, 7);
      return addDaysLima(prev, 1);
    });
  };

  const goToToday = () => setCurrentDate(nowLima());

  const formatDate = () => {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ];
    if (viewMode === 'mensual') {
      return `${monthNames[getLimaMonth(currentDate)]} ${getLimaYear(currentDate)}`;
    }
    if (viewMode === 'semanal') {
      const startOfWeek = addDaysLima(currentDate, -(getLimaDayOfWeek(currentDate) % 7));
      const endOfWeek = addDaysLima(startOfWeek, 6);
      return `${getLimaDay(startOfWeek)} - ${getLimaDay(endOfWeek)} ${monthNames[getLimaMonth(endOfWeek)]} ${getLimaYear(endOfWeek)}`;
    }
    return `${getLimaDay(currentDate)} de ${monthNames[getLimaMonth(currentDate)]} ${getLimaYear(currentDate)}`;
  };

  const viewOptions: { key: ViewMode; label: string }[] = [
    { key: 'mensual', label: 'Mensual' },
    { key: 'semanal', label: 'Semanal' },
    { key: 'diaria', label: 'Diaria' },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-2">
          <button onClick={navigatePrev} className="rounded-lg border border-gray-200 p-1.5 hover:bg-gray-50">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={goToToday} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50">
            Hoy
          </button>
          <button onClick={navigateNext} className="rounded-lg border border-gray-200 p-1.5 hover:bg-gray-50">
            <ChevronRight className="h-4 w-4" />
          </button>
          <h2 className="ml-2 text-lg font-semibold text-brand-500">{formatDate()}</h2>
        </div>

        <div className="flex items-center gap-1">
          {viewOptions.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setViewMode(key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                viewMode === key
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'border border-gray-300 text-gray-600 hover:border-brand-500 hover:text-brand-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="space-y-4 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-200" />
            ))}
          </div>
        ) : viewMode === 'mensual' ? (
          <CalendarMonth
            currentDate={currentDate}
            citas={citas}
            onNavigateToPatient={onNavigateToPatient}
            onDayClick={(date) => {
              setCurrentDate(date);
              setViewMode('diaria');
            }}
          />
        ) : viewMode === 'semanal' ? (
          <CalendarWeek currentDate={currentDate} citas={citas} onNavigateToPatient={onNavigateToPatient} />
        ) : (
          <CalendarDay currentDate={currentDate} citas={citas} onNavigateToPatient={onNavigateToPatient} />
        )}
      </div>
    </div>
  );
}
