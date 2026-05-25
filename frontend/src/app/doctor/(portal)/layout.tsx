'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import DoctorHeader from '@/components/doctor/DoctorHeader';

export default function DoctorPortalLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, _hasHydrated, hydrate, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (_hasHydrated && (!isAuthenticated || user?.rol !== 'MEDICO')) {
      router.push('/doctor/login');
    }
  }, [isAuthenticated, router, _hasHydrated, user]);

  if (!_hasHydrated || !isAuthenticated) {
    return (
      <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
        <DoctorHeader />
        <main className="flex-1 overflow-hidden" />
      </div>
    );
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