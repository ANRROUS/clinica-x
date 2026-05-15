'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CalendarMonth from './CalendarMonth';
import CalendarWeek from './CalendarWeek';
import CalendarDay from './CalendarDay';
import type { CitaCalendarioDTO } from '@/lib/api/types';

type ViewMode = 'mensual' | 'semanal' | 'diaria';

interface DoctorCalendarProps {
  citas: CitaCalendarioDTO[];
  onStatusChange: (id: string, estado: 'CONFIRMADA' | 'EN_ATENCION' | 'COMPLETADA' | 'CANCELADA') => void;
  onStartConsultation: (cita: CitaCalendarioDTO) => void;
  loading?: boolean;
}

export default function DoctorCalendar({ citas, onStatusChange, onStartConsultation, loading }: DoctorCalendarProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('semanal');
  const [currentDate, setCurrentDate] = useState(new Date());

  const navigatePrev = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'mensual') d.setMonth(d.getMonth() - 1);
      else if (viewMode === 'semanal') d.setDate(d.getDate() - 7);
      else d.setDate(d.getDate() - 1);
      return d;
    });
  };

  const navigateNext = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'mensual') d.setMonth(d.getMonth() + 1);
      else if (viewMode === 'semanal') d.setDate(d.getDate() + 7);
      else d.setDate(d.getDate() + 1);
      return d;
    });
  };

  const goToToday = () => setCurrentDate(new Date());

  const formatDate = () => {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ];
    if (viewMode === 'mensual') {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
    if (viewMode === 'semanal') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${monthNames[endOfWeek.getMonth()]} ${endOfWeek.getFullYear()}`;
    }
    return `${currentDate.getDate()} de ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
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
          <h2 className="ml-2 text-lg font-semibold text-gray-900">{formatDate()}</h2>
        </div>

        <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
          {viewOptions.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setViewMode(key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                viewMode === key ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex h-64 items-center justify-center text-gray-400">
            Cargando citas...
          </div>
        ) : viewMode === 'mensual' ? (
          <CalendarMonth currentDate={currentDate} citas={citas} onStartConsultation={onStartConsultation} />
        ) : viewMode === 'semanal' ? (
          <CalendarWeek currentDate={currentDate} citas={citas} onStatusChange={onStatusChange} onStartConsultation={onStartConsultation} />
        ) : (
          <CalendarDay currentDate={currentDate} citas={citas} onStatusChange={onStatusChange} onStartConsultation={onStartConsultation} />
        )}
      </div>
    </div>
  );
}