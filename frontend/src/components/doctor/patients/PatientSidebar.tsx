'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { ChevronLeft, ChevronRight, Users, Clock } from 'lucide-react';
import type { CitaCalendarioDTO } from '@/lib/api/types';
import { parseApiDate, nowLima, isSameDayLima } from '@clinica-x/date-utils';

interface PatientSidebarProps {
  citas: CitaCalendarioDTO[];
  slotDuration: number;
  onSelectPatient: (id: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function PatientSidebar({
  citas,
  slotDuration,
  onSelectPatient,
  collapsed = false,
  onToggleCollapse,
}: PatientSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const currentPatientId = pathname.split('/').pop();
  const now = nowLima();

  // ─── Actual: cita en curso (now está dentro del slot) ────────────────────
  const activeCita = useMemo(() => {
    return citas.find((c) => {
      const inicio = parseApiDate(c.fechaHora);
      const fin = new Date(inicio.getTime() + slotDuration * 60000);
      return now >= inicio && now <= fin;
    }) ?? null;
  }, [citas, slotDuration, now]);

  // ─── Para hoy: citas futuras del mismo día ─────────────────────────────
  const todayFuture = useMemo(() => {
    const excluded = new Set<string>();
    if (activeCita?.pacienteId) excluded.add(activeCita.pacienteId);

    const result = citas
      .filter((c) => {
        const fecha = parseApiDate(c.fechaHora);
        return (
          isSameDayLima(fecha, now) &&
          fecha.getTime() > now.getTime() &&
          !excluded.has(c.pacienteId)
        );
      })
      .sort((a, b) => parseApiDate(a.fechaHora).getTime() - parseApiDate(b.fechaHora).getTime());

    // dedup por paciente (primera cita del día)
    const seen = new Set<string>();
    return result.filter((c) => {
      if (seen.has(c.pacienteId)) return false;
      seen.add(c.pacienteId);
      return true;
    });
  }, [citas, now, activeCita]);

  // ─── General: resto de citas (pasadas o de otros días) ───────────────────
  const generalList = useMemo(() => {
    const excluded = new Set<string>();
    if (activeCita?.pacienteId) excluded.add(activeCita.pacienteId);
    todayFuture.forEach((c) => excluded.add(c.pacienteId));

    const unique = new Map<string, { id: string; name: string; fechaHora: string }>();
    citas.forEach((c) => {
      if (c.pacienteId && !excluded.has(c.pacienteId) && !unique.has(c.pacienteId)) {
        const name = `${c.pacienteNombre || ''} ${c.pacienteApellido || ''}`.trim() || 'Paciente';
        unique.set(c.pacienteId, { id: c.pacienteId, name, fechaHora: c.fechaHora });
      }
    });

    return Array.from(unique.values()).sort((a, b) => {
      const fa = parseApiDate(a.fechaHora).getTime();
      const fb = parseApiDate(b.fechaHora).getTime();
      return fb - fa; // más reciente primero
    });
  }, [citas, activeCita, todayFuture]);

  // ─── Render helpers ──────────────────────────────────────────────────────
  const PatientButton = ({
    p,
    isActive,
    showTime,
  }: {
    p: { id: string; name: string; fechaHora?: string };
    isActive?: boolean;
    showTime?: boolean;
  }) => {
    const isSelected = currentPatientId === p.id;
    return (
      <button
        key={p.id}
        onClick={() => router.push(`/doctor/pacientes/${p.id}`)}
        className={`flex items-center gap-3 w-full rounded-lg border-l-4 bg-white px-3 py-2 text-left text-sm font-medium transition-colors ${
          isSelected
            ? 'border-white text-brand-500'
            : isActive
              ? 'border-accent-500 text-gray-700 hover:bg-gray-50'
              : 'border-brand-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${isActive ? 'bg-accent-500' : 'bg-brand-500'}`}>
          {(p.name?.[0] || '?').toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <span className="truncate block">{p.name}</span>
          {showTime && p.fechaHora && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {p.fechaHora.slice(11, 16)}
            </span>
          )}
        </div>
      </button>
    );
  };

  if (collapsed) {
    return (
      <aside className="flex h-full w-14 flex-col items-center bg-brand-500 py-4">
        <button
          onClick={onToggleCollapse}
          className="mb-4 rounded-lg p-2 text-white hover:bg-brand-600"
          title="Expandir panel"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <button
          onClick={() => router.push('/doctor/pacientes')}
          className="mb-4 rounded-lg p-2 text-white hover:bg-brand-600"
          title="Pacientes"
        >
          <Users className="h-5 w-5" />
        </button>
        <div className="flex-1 space-y-2 overflow-y-auto">
          {activeCita && (
            <button
              onClick={() => router.push(`/doctor/pacientes/${activeCita.pacienteId}`)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-brand-500 hover:bg-gray-100"
              title={`${activeCita.pacienteNombre || ''} ${activeCita.pacienteApellido || ''}`}
            >
              {(activeCita.pacienteNombre?.[0] || '?').toUpperCase()}
            </button>
          )}
          {todayFuture.slice(0, 10).map((p) => {
            const initial = (p.pacienteNombre?.[0] || '?').toUpperCase();
            return (
              <button
                key={p.pacienteId}
                onClick={() => router.push(`/doctor/pacientes/${p.pacienteId}`)}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold hover:bg-gray-100 ${
                  currentPatientId === p.pacienteId ? 'bg-white text-brand-500' : 'bg-brand-400 text-white'
                }`}
                title={`${p.pacienteNombre || ''} ${p.pacienteApellido || ''}`}
              >
                {initial}
              </button>
            );
          })}
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-72 flex-col bg-brand-500">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-xs font-semibold uppercase text-white/90">Pacientes</p>
        <button
          onClick={onToggleCollapse}
          className="rounded-lg p-1.5 text-white hover:bg-brand-600"
          title="Colapsar panel"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Actual */}
      <p className="px-4 text-xs text-white/70">Actual</p>
      <div className="px-4 py-2">
        {activeCita ? (
          <PatientButton
            p={{
              id: activeCita.pacienteId,
              name: `${activeCita.pacienteNombre || ''} ${activeCita.pacienteApellido || ''}`.trim() || 'Paciente',
              fechaHora: activeCita.fechaHora,
            }}
            isActive
            showTime
          />
        ) : (
          <div className="rounded-lg border border-dashed border-white/40 bg-white/10 px-3 py-3">
            <p className="text-center text-xs text-white/70">Sin paciente en atención</p>
          </div>
        )}
      </div>

      {/* Para hoy */}
      <div className="px-4 py-3">
        <p className="text-xs font-semibold uppercase text-white/90">Para hoy</p>
        {todayFuture.length > 0 ? (
          <div className="mt-2 space-y-1">
            {todayFuture.map((p) => (
              <PatientButton
                key={p.pacienteId}
                p={{
                  id: p.pacienteId,
                  name: `${p.pacienteNombre || ''} ${p.pacienteApellido || ''}`.trim() || 'Paciente',
                  fechaHora: p.fechaHora,
                }}
                showTime
              />
            ))}
          </div>
        ) : (
          <div className="mt-2">
            <p className="text-xs text-white/70">Sin más citas hoy</p>
          </div>
        )}
      </div>

      {/* General */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <p className="text-xs font-semibold uppercase text-white/90 mb-2">General</p>
        {generalList.length > 0 ? (
          <div className="space-y-1">
            {generalList.map((p) => (
              <PatientButton key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-white/40 bg-white/10 px-3 py-3 mt-2 flex flex-col items-center justify-center gap-2">
            <Users className="h-5 w-5 text-white/70" />
            <p className="text-center text-xs text-white/70">No hay pacientes</p>
          </div>
        )}
      </div>
    </aside>
  );
}
