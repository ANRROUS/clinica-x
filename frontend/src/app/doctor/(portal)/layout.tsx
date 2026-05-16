'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDoctorAuthStore } from '@/store/useDoctorAuthStore';
import DoctorHeader from '@/components/doctor/DoctorHeader';

export default function DoctorPortalLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useDoctorAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/doctor/login');
    }
  }, [isAuthenticated, router, mounted]);

  if (!mounted || !isAuthenticated) return null;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <DoctorHeader />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
