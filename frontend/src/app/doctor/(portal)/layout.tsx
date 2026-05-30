'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDoctorAuthStore } from '@/store/useDoctorAuthStore';
import DoctorHeader from '@/components/doctor/DoctorHeader';

export default function DoctorPortalLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, _hasHydrated, user, hydrate } = useDoctorAuthStore();
  const router = useRouter();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (_hasHydrated && (!isAuthenticated || user?.rol !== 'MEDICO')) {
      router.push('/doctor/login');
    }
  }, [isAuthenticated, router, _hasHydrated, user]);

  if (!_hasHydrated || !isAuthenticated || user?.rol !== 'MEDICO') {
    return null;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <DoctorHeader />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
