'use client';

import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { parseApiDate, nowLima } from '@clinica-x/date-utils';

interface ConsultationTimerProps {
  fechaHora: string;
  slotDuration: number;
  onExpire?: () => void;
}

export default function ConsultationTimer({ fechaHora, slotDuration, onExpire }: ConsultationTimerProps) {
  const [remainingMs, setRemainingMs] = useState(() => {
    const inicio = parseApiDate(fechaHora).getTime();
    const fin = inicio + slotDuration * 60000;
    return Math.max(0, fin - nowLima().getTime());
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const inicio = parseApiDate(fechaHora).getTime();
      const fin = inicio + slotDuration * 60000;
      const remaining = Math.max(0, fin - nowLima().getTime());
      setRemainingMs(remaining);

      if (remaining === 0 && onExpire) {
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [fechaHora, slotDuration, onExpire]);

  const totalMinutes = Math.floor(remainingMs / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let timeString: string;
  if (hours > 0) {
    timeString = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  } else {
    timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  let colorClass = 'text-green-600';
  if (remainingMs <= 0) {
    colorClass = 'text-red-600';
  } else if (remainingMs <= 2 * 60000) {
    colorClass = 'text-red-600';
  } else if (remainingMs <= 5 * 60000) {
    colorClass = 'text-orange-600';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 text-sm font-semibold ${colorClass}`}>
      <Timer className="h-4 w-4" />
      <span className="tabular-nums min-w-[3.5ch]">{timeString}</span>
    </div>
  );
}
