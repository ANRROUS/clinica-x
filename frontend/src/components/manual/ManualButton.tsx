'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { HelpCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useDoctorAuthStore } from '@/store/useDoctorAuthStore';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';
import { manualData, type ManualSection } from '@/data/manualData';
import ManualModal from './ManualModal';

type RoleKey = 'paciente' | 'paciente_guest' | 'medico' | 'admin';

export default function ManualButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const patientAuth = useAuthStore((s) => s.isAuthenticated);
  const doctorAuth = useDoctorAuthStore((s) => s.isAuthenticated);
  const doctorHasHydrated = useDoctorAuthStore((s) => s._hasHydrated);
  const doctorUser = useDoctorAuthStore((s) => s.user);
  const adminAuth = useAdminAuthStore((s) => s.isAuthenticated);
  const adminHasHydrated = useAdminAuthStore((s) => s._hasHydrated);
  const adminUser = useAdminAuthStore((s) => s.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDoctorArea = pathname.startsWith('/doctor');
  const isAdminArea = pathname.startsWith('/admin');

  const roleKey: RoleKey | null = useMemo(() => {
    if (isDoctorArea) {
      if (doctorHasHydrated && doctorAuth && doctorUser?.rol === 'MEDICO') {
        return 'medico';
      }
      return null;
    }
    if (isAdminArea) {
      if (adminHasHydrated && adminAuth && adminUser?.rol === 'ADMIN') {
        return 'admin';
      }
      return null;
    }
    if (patientAuth) {
      return 'paciente';
    }
    return 'paciente_guest';
  }, [isDoctorArea, isAdminArea, doctorAuth, doctorHasHydrated, doctorUser, adminAuth, adminHasHydrated, adminUser, patientAuth]);

  if (!mounted) return null;
  if (!roleKey) return null;

  const roleData = manualData[roleKey];
  if (!roleData) return null;

  const sections: ManualSection[] = roleData.sections;
  const roleLabel =
    roleData.role === 'PACIENTE' ? 'Portal Usuario' : roleData.role === 'MEDICO' ? 'Portal Médico' : 'Portal Administrador';

  const shouldShow = !(isDoctorArea || isAdminArea) || roleKey !== 'paciente_guest';

  if (!shouldShow) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#008585] text-white shadow-lg hover:bg-[#007070] active:scale-95 transition-all"
        aria-label="Ayuda / Manual de Usuario"
        title="Manual de Usuario"
      >
        <HelpCircle className="h-7 w-7" />
      </button>

      <ManualModal
        sections={sections}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        roleLabel={roleLabel}
      />
    </>
  );
}
